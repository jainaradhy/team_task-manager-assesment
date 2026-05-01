import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const projectFilter =
    req.user.role === "Admin" 
      ? { workspaceId } 
      : { workspaceId, teamMembers: { some: { userId: req.user.id } } };

  const projects = await prisma.project.findMany({
    where: projectFilter,
    select: { id: true, title: true }
  });
  const projectIds = projects.map((project) => project.id);

  const [allTasks, myTasks, rawRecentActivity] = await Promise.all([
    prisma.task.findMany({
      where: { workspaceId, projectId: { in: projectIds } },
      include: {
        assignee: { select: { name: true } },
        project: { select: { title: true } }
      }
    }),
    prisma.task.findMany({
      where: { 
        workspaceId,
        projectId: { in: projectIds },
        assignedTo: req.user.id 
      },
      include: {
        project: { select: { title: true } }
      }
    }),
    projectIds.length
      ? prisma.activityLog.findMany({
          where: { workspaceId, projectId: { in: projectIds } },
          include: {
            user: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 8
        })
      : Promise.resolve([]),
  ]);

  const mappedMyTasks = myTasks.map(t => ({
    ...t, _id: t.id,
    assignedTo: { ...t.assignee },
    projectId: { ...t.project, _id: t.projectId }
  }));

  const recentActivity = rawRecentActivity.map(a => ({
    ...a, _id: a.id,
    performedBy: { ...a.user, role: "Member" } // Placeholder role for UI
  }));

  const now = new Date();
  const completedTasks = allTasks.filter((task) => task.status === "Done").length;
  const pendingTasks = allTasks.filter((task) => task.status !== "Done").length;
  const overdueTasks = allTasks.filter(
    (task) => task.status !== "Done" && new Date(task.dueDate) < now
  ).length;

  res.json({
    stats: {
      totalTasks: allTasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
      assignedToMe: myTasks.length,
      totalProjects: projects.length,
    },
    myTasks: mappedMyTasks,
    recentActivity,
  });
});

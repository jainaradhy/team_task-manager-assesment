import { ActivityLog, Project, ProjectTeam, Task } from "../models/index.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { formatActivity, formatTask } from "../utils/formatters.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;

  let projects;
  if (req.user.role === "Admin") {
    projects = await Project.find({ workspaceId }).select("title");
  } else {
    const team = await ProjectTeam.find({ userId: req.user.id }).populate("projectId", "title workspaceId");
    projects = team
      .map((member) => member.projectId)
      .filter((project) => project && project.workspaceId.toString() === workspaceId);
  }

  const projectIds = projects.map((project) => project._id);

  const [allTasks, myTasks, rawRecentActivity] = await Promise.all([
    Task.find({ workspaceId, projectId: { $in: projectIds } })
      .populate("assignedTo", "name email createdAt")
      .populate("projectId", "title"),
    Task.find({
      workspaceId,
      projectId: { $in: projectIds },
      assignedTo: req.user.id,
    })
      .populate("assignedTo", "name email createdAt")
      .populate("projectId", "title"),
    projectIds.length
      ? ActivityLog.find({ workspaceId, projectId: { $in: projectIds } })
          .populate("performedBy", "name email createdAt")
          .sort({ createdAt: -1 })
          .limit(8)
      : Promise.resolve([]),
  ]);

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
    myTasks: myTasks.map(formatTask),
    recentActivity: rawRecentActivity.map(formatActivity),
  });
});

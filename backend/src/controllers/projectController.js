import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can create projects", 403);
  }
  const { title, description, teamMembers = [] } = req.body;
  const workspaceId = req.user.workspaceId;

  const uniqueMemberIds = [...new Set([req.user.id, ...teamMembers])];
  const members = await prisma.workspaceMember.findMany({
    where: { 
      workspaceId: workspaceId,
      userId: { in: uniqueMemberIds } 
    },
    select: { userId: true }
  });

  if (members.length !== uniqueMemberIds.length) {
    throw new AppError("One or more team members are invalid or outside this workspace", 400);
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      workspaceId,
      createdBy: req.user.id,
      teamMembers: {
        create: uniqueMemberIds.map(userId => ({ userId }))
      }
    },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  await logActivity({
    workspaceId,
    action: "PROJECT_CREATED",
    entityType: "Project",
    entityId: project.id,
    projectId: project.id,
    performedBy: req.user.id,
    metadata: { title: project.title },
  });

  const formattedProject = {
    ...project,
    _id: project.id,
    createdBy: { ...project.creator, _id: project.creator.id },
    teamMembers: project.teamMembers.map(tm => ({ ...tm.user, _id: tm.user.id }))
  };
  delete formattedProject.creator;

  res.status(201).json(formattedProject);
});

export const getProjects = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const filter =
    req.user.role === "Admin"
      ? { workspaceId }
      : { workspaceId, teamMembers: { some: { userId: req.user.id } } };

  const projects = await prisma.project.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
    include: {
      tasks: { select: { id: true, status: true } },
      creator: { select: { id: true, name: true, email: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  const formattedProjects = projects.map((project) => ({
    ...project,
    _id: project.id,
    totalTasks: project.tasks.length,
    completedTasks: project.tasks.filter(t => t.status === "Done").length,
    createdBy: { ...project.creator, _id: project.creator.id },
    teamMembers: project.teamMembers.map(tm => ({ ...tm.user, _id: tm.user.id }))
  }));

  res.json(formattedProjects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, workspaceId },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const hasAccess =
    req.user.role === "Admin" ||
    project.teamMembers.some((member) => member.userId === req.user.id);

  if (!hasAccess) {
    throw new AppError("You do not have access to this project", 403);
  }

  const tasks = await prisma.task.findMany({
    where: { projectId: project.id, workspaceId },
    include: {
      assignee: { select: { id: true, name: true, email: true } }
    },
    orderBy: { dueDate: 'asc' }
  });

  const formattedProject = {
    ...project,
    _id: project.id,
    createdBy: { ...project.creator, _id: project.creator.id },
    teamMembers: project.teamMembers.map(tm => ({ ...tm.user, _id: tm.user.id })),
    tasks: tasks.map(t => ({
      ...t,
      _id: t.id,
      assignedTo: { ...t.assignee, _id: t.assignee.id }
    }))
  };

  res.json(formattedProject);
});

export const updateProjectMembers = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can update project members", 403);
  }
  const { teamMembers } = req.body;
  const workspaceId = req.user.workspaceId;
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, workspaceId }
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const uniqueMemberIds = [...new Set([project.createdBy, ...teamMembers])];
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId, userId: { in: uniqueMemberIds } },
    select: { userId: true }
  });

  if (members.length !== uniqueMemberIds.length) {
    throw new AppError("One or more team members are invalid", 400);
  }

  // Transaction to update members
  await prisma.$transaction([
    prisma.projectTeam.deleteMany({ where: { projectId: project.id } }),
    prisma.projectTeam.createMany({
      data: uniqueMemberIds.map(userId => ({ projectId: project.id, userId }))
    })
  ]);

  await logActivity({
    workspaceId,
    action: "PROJECT_MEMBERS_UPDATED",
    entityType: "Project",
    entityId: project.id,
    projectId: project.id,
    performedBy: req.user.id,
    metadata: { teamMembers: uniqueMemberIds },
  });

  const updatedProject = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  res.json({
    ...updatedProject,
    _id: updatedProject.id,
    createdBy: { ...updatedProject.creator, _id: updatedProject.creator.id },
    teamMembers: updatedProject.teamMembers.map(tm => ({ ...tm.user, _id: tm.user.id }))
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can delete projects", 403);
  }
  const workspaceId = req.user.workspaceId;
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, workspaceId }
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await prisma.project.delete({ where: { id: project.id } });

  await logActivity({
    workspaceId,
    action: "PROJECT_DELETED",
    entityType: "Project",
    entityId: project.id,
    projectId: project.id,
    performedBy: req.user.id,
    metadata: { title: project.title },
  });

  res.json({ message: "Project deleted successfully" });
});

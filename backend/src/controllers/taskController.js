import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";

const canAccessProject = async (projectId, userId, workspaceId) => {
  const count = await prisma.projectTeam.count({
    where: { projectId, userId, project: { workspaceId } }
  });
  return count > 0;
};

export const createTask = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can create tasks", 403);
  }
  const { title, description, projectId, assignedTo, dueDate, status, priority } = req.body;
  const workspaceId = req.user.workspaceId;

  const [project, assignee] = await Promise.all([
    prisma.project.findFirst({ where: { id: projectId, workspaceId } }),
    prisma.workspaceMember.findFirst({ where: { userId: assignedTo, workspaceId }, select: { userId: true } }),
  ]);

  if (!project) throw new AppError("Project not found", 404);
  if (!assignee) throw new AppError("Assignee not found in this workspace", 404);

  const hasAccess = await canAccessProject(projectId, assignedTo, workspaceId);
  if (!hasAccess) throw new AppError("Assignee must be a project member", 400);

  const task = await prisma.task.create({
    data: {
      title, description, projectId, workspaceId, assignedTo,
      dueDate: new Date(dueDate),
      status: status || "Todo",
      priority: priority || "Medium",
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      project: { select: { title: true } }
    }
  });

  await logActivity({
    workspaceId, action: "TASK_CREATED", entityType: "Task", entityId: task.id,
    projectId, performedBy: req.user.id, metadata: { title: task.title, assignedTo },
  });

  res.status(201).json({
    ...task, _id: task.id,
    assignedTo: { ...task.assignee, _id: task.assignee.id },
    projectId: { ...task.project, _id: task.projectId }
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { search = "", projectId, status, priority, assignedTo, page = 1, limit = 12, sortBy = "dueDate", sortOrder = "asc" } = req.query;
  const workspaceId = req.user.workspaceId;

  let allowedProjectIds = [];

  if (req.user.role === "Admin") {
    const projects = await prisma.project.findMany({ where: { workspaceId }, select: { id: true } });
    allowedProjectIds = projects.map((project) => project.id);
  } else {
    const projects = await prisma.projectTeam.findMany({
      where: { userId: req.user.id, project: { workspaceId } },
      select: { projectId: true }
    });
    allowedProjectIds = projects.map((project) => project.projectId);
  }

  const where = { workspaceId, projectId: { in: allowedProjectIds } };

  if (projectId) {
    if (!allowedProjectIds.includes(projectId)) throw new AppError("You do not have access to this project", 403);
    where.projectId = projectId;
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assignedTo) where.assignedTo = assignedTo;
  if (req.user.role === "Member") where.assignedTo = req.user.id;
  if (search) {
    where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
  }

  const skip = (Number(page) - 1) * Number(limit);
  
  // Handle custom sorting
  const orderBy = [];
  if (sortBy === "priority") {
    // Prisma can't sort by enum mapping natively in SQLite easily, but since Low/Medium/High don't sort alphabetically to their importance,
    // we'll just sort alphabetically for now (High, Low, Medium). A real app might map them to integers.
    orderBy.push({ priority: sortOrder });
  } else {
    orderBy.push({ dueDate: sortOrder });
  }
  orderBy.push({ createdAt: 'desc' });

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where, include: { assignee: { select: { id: true, name: true, email: true } }, project: { select: { title: true } } },
      orderBy, skip, take: Number(limit),
    }),
    prisma.task.count({ where }),
  ]);

  const formattedTasks = tasks.map(t => ({
    ...t, _id: t.id,
    assignedTo: { ...t.assignee, _id: t.assignee.id },
    projectId: { ...t.project, _id: t.projectId }
  }));

  res.json({ data: formattedTasks, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } });
});

export const updateTask = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const task = await prisma.task.findFirst({ where: { id: req.params.id, workspaceId } });
  if (!task) throw new AppError("Task not found", 404);

  const project = await prisma.project.findUnique({ where: { id: task.projectId } });
  if (!project) throw new AppError("Project not found", 404);

  const isAssignedMember = task.assignedTo === req.user.id;
  if (req.user.role === "Member" && !isAssignedMember) throw new AppError("You can only update your own tasks", 403);

  const data = req.user.role === "Member"
    ? { status: req.body.status, priority: req.body.priority } // Members can update status/priority if they own it
    : {
        title: req.body.title ?? task.title, description: req.body.description ?? task.description,
        assignedTo: req.body.assignedTo ?? task.assignedTo, dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
        status: req.body.status ?? task.status,
        priority: req.body.priority ?? task.priority,
      };

  if (data.assignedTo && data.assignedTo !== task.assignedTo) {
    const hasAccess = await canAccessProject(task.projectId, data.assignedTo, workspaceId);
    if (!hasAccess) throw new AppError("Assignee must be a project member", 400);
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id }, data,
    include: { assignee: { select: { id: true, name: true, email: true } }, project: { select: { title: true } } }
  });

  await logActivity({
    workspaceId, action: "TASK_UPDATED", entityType: "Task", entityId: task.id,
    projectId: task.projectId, performedBy: req.user.id, metadata: data,
  });

  res.json({
    ...updatedTask, _id: updatedTask.id,
    assignedTo: { ...updatedTask.assignee, _id: updatedTask.assignee.id },
    projectId: { ...updatedTask.project, _id: updatedTask.projectId }
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can delete tasks", 403);
  }
  const workspaceId = req.user.workspaceId;
  const task = await prisma.task.findFirst({ where: { id: req.params.id, workspaceId } });
  if (!task) throw new AppError("Task not found", 404);

  await prisma.task.delete({ where: { id: task.id } });
  await logActivity({
    workspaceId, action: "TASK_DELETED", entityType: "Task", entityId: task.id,
    projectId: task.projectId, performedBy: req.user.id, metadata: { title: task.title },
  });

  res.json({ message: "Task deleted successfully" });
});

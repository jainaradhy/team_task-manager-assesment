import { Project, ProjectTeam, Task, WorkspaceMember } from "../models/index.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";
import { formatTask, idOf } from "../utils/formatters.js";

const canAccessProject = async (projectId, userId, workspaceId) => {
  const project = await Project.exists({ _id: projectId, workspaceId });
  if (!project) return false;

  const member = await ProjectTeam.exists({ projectId, userId });
  return Boolean(member);
};

const getAllowedProjectIds = async (req) => {
  if (req.user.role === "Admin") {
    const projects = await Project.find({ workspaceId: req.user.workspaceId }).select("_id");
    return projects.map((project) => project._id);
  }

  const team = await ProjectTeam.find({ userId: req.user.id }).populate("projectId", "workspaceId");
  return team
    .filter((member) => member.projectId && idOf(member.projectId.workspaceId) === req.user.workspaceId)
    .map((member) => member.projectId._id);
};

const populateTask = (query) => query.populate("assignedTo", "name email createdAt").populate("projectId", "title");

export const createTask = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can create tasks", 403);
  }

  const { title, description, projectId, assignedTo, dueDate, status, priority } = req.body;
  const workspaceId = req.user.workspaceId;

  const [project, assignee] = await Promise.all([
    Project.findOne({ _id: projectId, workspaceId }),
    WorkspaceMember.findOne({ userId: assignedTo, workspaceId }).select("userId"),
  ]);

  if (!project) throw new AppError("Project not found", 404);
  if (!assignee) throw new AppError("Assignee not found in this workspace", 404);

  const hasAccess = await canAccessProject(projectId, assignedTo, workspaceId);
  if (!hasAccess) throw new AppError("Assignee must be a project member", 400);

  const task = await Task.create({
    title,
    description,
    projectId,
    workspaceId,
    assignedTo,
    dueDate: new Date(dueDate),
    status: status || "Todo",
    priority: priority || "Medium",
  });

  await logActivity({
    workspaceId,
    action: "TASK_CREATED",
    entityType: "Task",
    entityId: idOf(task),
    projectId,
    performedBy: req.user.id,
    metadata: { title: task.title, assignedTo },
  });

  const populatedTask = await populateTask(Task.findById(task._id));
  res.status(201).json(formatTask(populatedTask));
});

export const getTasks = asyncHandler(async (req, res) => {
  const {
    search = "",
    projectId,
    status,
    priority,
    assignedTo,
    page = 1,
    limit = 12,
    sortBy = "dueDate",
    sortOrder = "asc",
  } = req.query;
  const workspaceId = req.user.workspaceId;

  const allowedProjectIds = await getAllowedProjectIds(req);
  const filter = { workspaceId, projectId: { $in: allowedProjectIds } };

  if (projectId) {
    if (!allowedProjectIds.some((allowedId) => idOf(allowedId) === projectId)) {
      throw new AppError("You do not have access to this project", 403);
    }
    filter.projectId = projectId;
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (req.user.role === "Member") filter.assignedTo = req.user.id;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = sortBy === "priority"
    ? { priority: sortOrder === "desc" ? -1 : 1, createdAt: -1 }
    : { dueDate: sortOrder === "desc" ? -1 : 1, createdAt: -1 };

  const [tasks, total] = await Promise.all([
    populateTask(Task.find(filter).sort(sort).skip(skip).limit(Number(limit))),
    Task.countDocuments(filter),
  ]);

  res.json({
    data: tasks.map(formatTask),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const task = await Task.findOne({ _id: req.params.id, workspaceId });
  if (!task) throw new AppError("Task not found", 404);

  const project = await Project.findById(task.projectId);
  if (!project) throw new AppError("Project not found", 404);

  const isAssignedMember = idOf(task.assignedTo) === req.user.id;
  if (req.user.role === "Member" && !isAssignedMember) {
    throw new AppError("You can only update your own tasks", 403);
  }

  const data = req.user.role === "Member"
    ? {
        status: req.body.status ?? task.status,
        priority: req.body.priority ?? task.priority,
      }
    : {
        title: req.body.title ?? task.title,
        description: req.body.description ?? task.description,
        assignedTo: req.body.assignedTo ?? task.assignedTo,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
        status: req.body.status ?? task.status,
        priority: req.body.priority ?? task.priority,
      };

  if (data.assignedTo && idOf(data.assignedTo) !== idOf(task.assignedTo)) {
    const hasAccess = await canAccessProject(task.projectId, data.assignedTo, workspaceId);
    if (!hasAccess) throw new AppError("Assignee must be a project member", 400);
  }

  const updatedTask = await populateTask(
    Task.findByIdAndUpdate(task._id, data, { new: true, runValidators: true })
  );

  await logActivity({
    workspaceId,
    action: "TASK_UPDATED",
    entityType: "Task",
    entityId: idOf(task),
    projectId: idOf(task.projectId),
    performedBy: req.user.id,
    metadata: data,
  });

  res.json(formatTask(updatedTask));
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can delete tasks", 403);
  }

  const workspaceId = req.user.workspaceId;
  const task = await Task.findOne({ _id: req.params.id, workspaceId });
  if (!task) throw new AppError("Task not found", 404);

  await Task.deleteOne({ _id: task._id });
  await logActivity({
    workspaceId,
    action: "TASK_DELETED",
    entityType: "Task",
    entityId: idOf(task),
    projectId: idOf(task.projectId),
    performedBy: req.user.id,
    metadata: { title: task.title },
  });

  res.json({ message: "Task deleted successfully" });
});

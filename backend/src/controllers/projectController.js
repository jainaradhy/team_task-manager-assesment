import { Project, ProjectTeam, Task, WorkspaceMember } from "../models/index.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { logActivity } from "../utils/logActivity.js";
import { formatTask, formatUser, idOf } from "../utils/formatters.js";

const getProjectTeamUsers = async (projectId) => {
  const team = await ProjectTeam.find({ projectId }).populate("userId", "name email createdAt");
  return team.map((member) => formatUser(member.userId));
};

const formatProject = async (project, { includeTasks = false, includeTaskCounts = false } = {}) => {
  const creator = await project.populate("createdBy", "name email createdAt");
  const teamMembers = await getProjectTeamUsers(project._id);
  const plain = creator.toObject({ virtuals: true });

  const formatted = {
    ...plain,
    id: idOf(project),
    _id: idOf(project),
    workspaceId: idOf(project.workspaceId),
    createdBy: formatUser(project.createdBy),
    teamMembers,
  };

  if (includeTaskCounts) {
    const tasks = await Task.find({ projectId: project._id }).select("status");
    formatted.totalTasks = tasks.length;
    formatted.completedTasks = tasks.filter((task) => task.status === "Done").length;
  }

  if (includeTasks) {
    const tasks = await Task.find({ projectId: project._id, workspaceId: project.workspaceId })
      .populate("assignedTo", "name email createdAt")
      .populate("projectId", "title")
      .sort({ dueDate: 1 });
    formatted.tasks = tasks.map(formatTask);
  }

  return formatted;
};

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can create projects", 403);
  }

  const { title, description, teamMembers = [] } = req.body;
  const workspaceId = req.user.workspaceId;
  const uniqueMemberIds = [...new Set([req.user.id, ...teamMembers])];

  const members = await WorkspaceMember.find({
    workspaceId,
    userId: { $in: uniqueMemberIds },
  }).select("userId");

  if (members.length !== uniqueMemberIds.length) {
    throw new AppError("One or more team members are invalid or outside this workspace", 400);
  }

  const project = await Project.create({
    title,
    description,
    workspaceId,
    createdBy: req.user.id,
  });

  await ProjectTeam.create(uniqueMemberIds.map((userId) => ({ projectId: project._id, userId })));

  await logActivity({
    workspaceId,
    action: "PROJECT_CREATED",
    entityType: "Project",
    entityId: idOf(project),
    projectId: idOf(project),
    performedBy: req.user.id,
    metadata: { title: project.title },
  });

  res.status(201).json(await formatProject(project));
});

export const getProjects = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  let projectIds = null;

  if (req.user.role !== "Admin") {
    const team = await ProjectTeam.find({ userId: req.user.id }).select("projectId");
    projectIds = team.map((member) => member.projectId);
  }

  const filter = req.user.role === "Admin"
    ? { workspaceId }
    : { workspaceId, _id: { $in: projectIds } };

  const projects = await Project.find(filter).sort({ createdAt: -1 });
  const formattedProjects = await Promise.all(
    projects.map((project) => formatProject(project, { includeTaskCounts: true }))
  );

  res.json(formattedProjects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const project = await Project.findOne({ _id: req.params.id, workspaceId });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const membership = await ProjectTeam.exists({ projectId: project._id, userId: req.user.id });
  const hasAccess = req.user.role === "Admin" || membership;

  if (!hasAccess) {
    throw new AppError("You do not have access to this project", 403);
  }

  res.json(await formatProject(project, { includeTasks: true }));
});

export const updateProjectMembers = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can update project members", 403);
  }

  const { teamMembers } = req.body;
  const workspaceId = req.user.workspaceId;
  const project = await Project.findOne({ _id: req.params.id, workspaceId });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const uniqueMemberIds = [...new Set([idOf(project.createdBy), ...teamMembers])];
  const members = await WorkspaceMember.find({
    workspaceId,
    userId: { $in: uniqueMemberIds },
  }).select("userId");

  if (members.length !== uniqueMemberIds.length) {
    throw new AppError("One or more team members are invalid", 400);
  }

  await ProjectTeam.deleteMany({ projectId: project._id });
  await ProjectTeam.create(uniqueMemberIds.map((userId) => ({ projectId: project._id, userId })));

  await logActivity({
    workspaceId,
    action: "PROJECT_MEMBERS_UPDATED",
    entityType: "Project",
    entityId: idOf(project),
    projectId: idOf(project),
    performedBy: req.user.id,
    metadata: { teamMembers: uniqueMemberIds },
  });

  res.json(await formatProject(project));
});

export const deleteProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "Admin") {
    throw new AppError("Only admins can delete projects", 403);
  }

  const workspaceId = req.user.workspaceId;
  const project = await Project.findOne({ _id: req.params.id, workspaceId });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await Promise.all([
    Project.deleteOne({ _id: project._id }),
    ProjectTeam.deleteMany({ projectId: project._id }),
    Task.deleteMany({ projectId: project._id }),
  ]);

  await logActivity({
    workspaceId,
    action: "PROJECT_DELETED",
    entityType: "Project",
    entityId: idOf(project),
    projectId: idOf(project),
    performedBy: req.user.id,
    metadata: { title: project.title },
  });

  res.json({ message: "Project deleted successfully" });
});

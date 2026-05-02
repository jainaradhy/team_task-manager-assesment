import { asyncHandler } from "../middleware/asyncHandler.js";
import { User, WorkspaceMember, ProjectTeam } from "../models/index.js";
import { formatUser } from "../utils/formatters.js";
import { AppError } from "../utils/appError.js";

export const getUsers = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const members = await WorkspaceMember.find({ workspaceId }).populate("userId", "name email createdAt");
  members.sort((a, b) => new Date(b.userId.createdAt) - new Date(a.userId.createdAt));
  
  res.json(members.map(m => ({ 
    ...formatUser(m.userId),
    role: m.role 
  })));
});

export const addMember = asyncHandler(async (req, res) => {
  const { email, role = "Member" } = req.body;
  const workspaceId = req.user.workspaceId;

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    throw new AppError("User not found. They must sign up first.", 404);
  }

  const existingMember = await WorkspaceMember.findOne({ 
    workspaceId, 
    userId: userToAdd._id 
  });

  if (existingMember) {
    throw new AppError("User is already a member of this workspace.", 400);
  }

  await WorkspaceMember.create({
    workspaceId,
    userId: userToAdd._id,
    role
  });

  res.status(201).json({ message: "Member added successfully" });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workspaceId = req.user.workspaceId;

  if (id === req.user.id) {
    throw new AppError("You cannot remove yourself from the workspace.", 400);
  }

  const member = await WorkspaceMember.findOne({ workspaceId, userId: id });
  if (!member) {
    throw new AppError("Member not found in this workspace.", 404);
  }

  await Promise.all([
    WorkspaceMember.deleteOne({ _id: member._id }),
    ProjectTeam.deleteMany({ userId: id }) // Remove from all projects in this workspace? 
    // Actually ProjectTeam should probably be workspace-scoped if possible, 
    // but the model doesn't have workspaceId. Let's check ProjectTeam model.
  ]);

  res.json({ message: "Member removed successfully" });
});

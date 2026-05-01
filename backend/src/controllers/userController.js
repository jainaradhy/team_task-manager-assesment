import { asyncHandler } from "../middleware/asyncHandler.js";
import { WorkspaceMember } from "../models/index.js";
import { formatUser } from "../utils/formatters.js";

export const getUsers = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const members = await WorkspaceMember.find({ workspaceId }).populate("userId", "name email createdAt");
  members.sort((a, b) => new Date(b.userId.createdAt) - new Date(a.userId.createdAt));
  
  res.json(members.map(m => ({ 
    ...formatUser(m.userId),
    role: m.role 
  })));
});

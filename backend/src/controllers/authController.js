import bcrypt from "bcryptjs";
import { User, Workspace, WorkspaceMember } from "../models/index.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { AppError } from "../utils/appError.js";
import { idOf } from "../utils/formatters.js";

const sanitizeUser = (user, role, workspaceId) => ({
  id: idOf(user),
  _id: idOf(user),
  name: user.name,
  email: user.email,
  role: role,
  workspaceId: idOf(workspaceId),
  createdAt: user.createdAt,
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, companyName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const wName = companyName || `${name}'s Workspace`;

  const user = await User.create({ name, email, password: hashedPassword });
  const workspace = await Workspace.create({ name: wName });
  const member = await WorkspaceMember.create({
    userId: user._id,
    workspaceId: workspace._id,
    role: "Admin",
  });

  const token = generateToken({ 
    id: idOf(user),
    role: member.role,
    workspaceId: idOf(workspace),
  });

  res.status(201).json({
    message: "Account and Workspace created successfully",
    token,
    user: sanitizeUser(user, member.role, workspace),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const primaryWorkspace = user
    ? await WorkspaceMember.findOne({ userId: user._id }).sort({ createdAt: 1 })
    : null;

  if (!user || !primaryWorkspace) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ 
    id: idOf(user),
    role: primaryWorkspace.role,
    workspaceId: idOf(primaryWorkspace.workspaceId),
  });

  res.json({
    message: "Login successful",
    token,
    user: sanitizeUser(user, primaryWorkspace.role, primaryWorkspace.workspaceId),
  });
});

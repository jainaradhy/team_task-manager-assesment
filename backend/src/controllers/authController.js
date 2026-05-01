import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { AppError } from "../utils/appError.js";

const sanitizeUser = (user, role, workspaceId) => ({
  id: user.id,
  _id: user.id, // For frontend compatibility
  name: user.name,
  email: user.email,
  role: role,
  workspaceId: workspaceId,
  createdAt: user.createdAt,
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, companyName } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const wName = companyName || `${name}'s Workspace`;

  // Transaction: Create User, Workspace, and link them as Owner
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword },
    });

    const workspace = await tx.workspace.create({
      data: { name: wName },
    });

    const member = await tx.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "Admin", // Admin acts as the Owner for the SaaS UI
      },
    });

    return { user, workspace, member };
  });

  const token = generateToken({ 
    id: result.user.id, 
    role: result.member.role,
    workspaceId: result.workspace.id 
  });

  res.status(201).json({
    message: "Account and Workspace created successfully",
    token,
    user: sanitizeUser(result.user, result.member.role, result.workspace.id),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ 
    where: { email },
    include: {
      workspaces: {
        take: 1 // For now, we assume user has 1 primary workspace
      }
    }
  });

  if (!user || user.workspaces.length === 0) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const primaryWorkspace = user.workspaces[0];
  const token = generateToken({ 
    id: user.id, 
    role: primaryWorkspace.role,
    workspaceId: primaryWorkspace.workspaceId
  });

  res.json({
    message: "Login successful",
    token,
    user: sanitizeUser(user, primaryWorkspace.role, primaryWorkspace.workspaceId),
  });
});

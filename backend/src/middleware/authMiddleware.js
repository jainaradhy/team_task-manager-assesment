import jwt from "jsonwebtoken";
import { WorkspaceMember } from "../models/index.js";
import { formatUser, idOf } from "../utils/formatters.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure the user actually belongs to this workspace and is active
    const member = await WorkspaceMember.findOne({
      workspaceId: decoded.workspaceId,
      userId: decoded.id,
    }).populate("userId", "name email createdAt");

    if (!member || !member.userId) {
      return res.status(401).json({ message: "Workspace access denied or user no longer exists" });
    }

    const user = formatUser(member.userId);

    // Attach user and active workspace context to the request
    req.user = { 
      ...user,
      role: member.role,
      workspaceId: idOf(member.workspaceId),
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Insufficient permissions for this workspace" });
  }

  next();
};

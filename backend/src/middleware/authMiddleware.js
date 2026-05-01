import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure the user actually belongs to this workspace and is active
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: decoded.workspaceId,
          userId: decoded.id
        }
      },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } }
      }
    });

    if (!member) {
      return res.status(401).json({ message: "Workspace access denied or user no longer exists" });
    }

    // Attach user and active workspace context to the request
    req.user = { 
      ...member.user, 
      _id: member.user.id,
      role: member.role,
      workspaceId: member.workspaceId
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

import { prisma } from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        }
      }
    },
    orderBy: {
      user: { createdAt: 'desc' }
    }
  });
  
  res.json(members.map(m => ({ 
    ...m.user, 
    _id: m.user.id,
    role: m.role 
  })));
});

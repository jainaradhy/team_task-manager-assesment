import { prisma } from "../config/db.js";

export const logActivity = async ({
  workspaceId,
  action,
  entityType,
  entityId,
  projectId,
  performedBy,
  metadata = {},
}) => {
  try {
    if (!workspaceId) throw new Error("workspaceId is required for activity logging");
    await prisma.activityLog.create({
      data: {
        workspaceId,
        action,
        entityType,
        entityId: String(entityId),
        projectId: projectId ? String(projectId) : null,
        performedBy: String(performedBy),
        metadata: JSON.stringify(metadata),
      },
    });
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
};

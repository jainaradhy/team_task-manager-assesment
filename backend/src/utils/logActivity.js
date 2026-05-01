import { ActivityLog } from "../models/index.js";

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
    await ActivityLog.create({
      workspaceId,
      action,
      entityType,
      entityId: String(entityId),
      projectId: projectId || null,
      performedBy,
      metadata,
    });
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
};

// services/activityLogService.ts
import { ActivityLog } from "../models/activity.model.ts";

export const logActivity = async (
  userMatricule: string,
  action: string,
  entity: string,
  entityId?: string
) => {
  try {
    await ActivityLog.create({
      userMatricule,
      action,
      entity,
      entityId,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout au journal d'activité :", err);
  }
};

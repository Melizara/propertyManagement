// routes/activityLog.routes.ts
import { Router } from "express";
import  {ActivityLog} from "../models/activity.model.ts";

const activityRouter = Router();

activityRouter.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({ order: [["timestamp", "DESC"]] });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des logs", error: err });
  }
});

export default activityRouter;

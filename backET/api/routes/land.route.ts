import { Router } from "express";
import { createLand, deleteLand, getLand, getLands, getStationForLand, updateLand } from "../controllers/land.controller.ts";
import { protectAuth } from "../middlewares/protectAuth.ts";
const landRouter = Router();

landRouter.post("/", protectAuth, createLand);
landRouter.get("/", getLands);
landRouter.get("/station",getStationForLand);
landRouter.get("/:codeLand", getLand);
landRouter.put("/:codeLand",protectAuth, updateLand);
landRouter.delete("/:codeLand",protectAuth, deleteLand);

export default landRouter;

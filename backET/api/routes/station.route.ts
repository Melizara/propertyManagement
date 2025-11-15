import { Router } from "express";
import { createStation,getStation,getStations,updateStation,deleteStation } from "../controllers/station.controller.ts";
import { protectAuth } from "../middlewares/protectAuth.ts";

const stationRouter = Router();

stationRouter.post("/", protectAuth, createStation);
stationRouter.get("/",getStations);
stationRouter.get("/:codeStation", getStation);
stationRouter.put("/:codeStation", protectAuth, updateStation);
stationRouter.delete("/:codeStation", protectAuth,deleteStation);

export default stationRouter;
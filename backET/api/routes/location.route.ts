import { Router } from "express";
import { protectAuth } from "../middlewares/protectAuth.ts";
import { createLocation, deleteLocation, getLocation, getLocations, updateLocation } from "../controllers/location.controller.ts";



const locationRouter = Router();

locationRouter.post("/", protectAuth, createLocation);
locationRouter.get("/", getLocations);
locationRouter.get("/:codeLocation", getLocation);
locationRouter.put("/:codeLocation", protectAuth, updateLocation);
locationRouter.delete("/:codeLocation", protectAuth, deleteLocation)

export default locationRouter;
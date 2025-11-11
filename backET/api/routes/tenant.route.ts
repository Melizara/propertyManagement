import { Router } from "express";
import { createTenant, deleteTenant, getTenant, getTenants, updateTenant } from "../controllers/tenant.controller.ts";
import { protectAuth } from "../middlewares/protectAuth.ts";
const tenantRouter = Router();

tenantRouter.post("/", protectAuth, createTenant);
tenantRouter.get("/", getTenants);
tenantRouter.get("/:cin", getTenant);
tenantRouter.put("/:cin", protectAuth, updateTenant);
tenantRouter.delete("/:cin", protectAuth, deleteTenant);

export default tenantRouter;

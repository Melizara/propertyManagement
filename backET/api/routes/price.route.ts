import { Router } from "express";
import { protectAuth } from "../middlewares/protectAuth.ts";
import { createPrice } from "../controllers/price.controller.ts";

const priceRouter = Router();

priceRouter.post("/",protectAuth, createPrice);

export default priceRouter;
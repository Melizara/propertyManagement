import { Router } from "express";
import { protectAuth } from "../middlewares/protectAuth.ts";
import { createPrice, getPrices } from "../controllers/price.controller.ts";

const priceRouter = Router();

priceRouter.post("/",protectAuth, createPrice);
priceRouter.get("/", getPrices)

export default priceRouter;
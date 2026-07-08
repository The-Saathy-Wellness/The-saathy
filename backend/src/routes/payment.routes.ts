import { Router } from "express";
import { createOrder } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const paymentRouter = Router();

paymentRouter.use(requireAuth);
paymentRouter.post("/orders", asyncHandler(createOrder));

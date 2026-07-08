import { Router } from "express";
import { createCheckIn } from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.post("/check-ins", asyncHandler(createCheckIn));

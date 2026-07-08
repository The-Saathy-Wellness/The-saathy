import { Router } from "express";
import { createCallToken, matchListener } from "../controllers/listener.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const listenerRouter = Router();

listenerRouter.use(requireAuth);
listenerRouter.post("/match", asyncHandler(matchListener));
listenerRouter.post("/calls/token", asyncHandler(createCallToken));

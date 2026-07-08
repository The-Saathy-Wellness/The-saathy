import { Router } from "express";
import { chat } from "../controllers/ai.controller";
import { optionalAuth } from "../middleware/optionalAuth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const aiRouter = Router();

aiRouter.post("/chat", optionalAuth, asyncHandler(chat));

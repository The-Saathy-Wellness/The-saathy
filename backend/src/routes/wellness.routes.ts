import { Router } from "express";
import { createJournal, createPulse, listJournals, pulseSummary } from "../controllers/wellness.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const wellnessRouter = Router();

wellnessRouter.use(requireAuth);
wellnessRouter.post("/journals", asyncHandler(createJournal));
wellnessRouter.get("/journals", asyncHandler(listJournals));
wellnessRouter.post("/daily-pulse", asyncHandler(createPulse));
wellnessRouter.get("/daily-pulse/summary", asyncHandler(pulseSummary));

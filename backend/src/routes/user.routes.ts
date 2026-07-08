import { Router } from "express";
import { me, updateProfile } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/me", asyncHandler(me));
userRouter.patch("/me", asyncHandler(updateProfile));

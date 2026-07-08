import { Router } from "express";
import { aiRouter } from "./ai.routes";
import { authRouter } from "./auth.routes";
import { listenerRouter } from "./listener.routes";
import { notificationRouter } from "./notification.routes";
import { paymentRouter } from "./payment.routes";
import { userRouter } from "./user.routes";
import { wellnessRouter } from "./wellness.routes";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/ai", aiRouter);
router.use("/wellness", wellnessRouter);
router.use("/listeners", listenerRouter);
router.use("/payments", paymentRouter);
router.use("/notifications", notificationRouter);

import { Response } from "express";
import { AppError } from "../exceptions/AppError";
import { NotificationService } from "../services/notification.service";
import { AuthedRequest } from "../types";

const notifications = new NotificationService();

export const createCheckIn = async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new AppError(401, "UNAUTHENTICATED", "Missing authenticated user");
  res.status(201).json(await notifications.createCheckIn(req.user.id, req.body?.message));
};

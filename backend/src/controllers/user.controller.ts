import { Response } from "express";
import { AppError } from "../exceptions/AppError";
import { UserService } from "../services/user.service";
import { AuthedRequest } from "../types";
import { validateBody } from "../utils/validation";
import { updateProfileSchema } from "../validators/user.validators";

const users = new UserService();

const userId = (req: AuthedRequest) => {
  if (!req.user) throw new AppError(401, "UNAUTHENTICATED", "Missing authenticated user");
  return req.user.id;
};

export const me = async (req: AuthedRequest, res: Response) => {
  res.json(await users.me(userId(req)));
};

export const updateProfile = async (req: AuthedRequest, res: Response) => {
  const body = validateBody(updateProfileSchema, req);
  res.json(await users.updateProfile(userId(req), body));
};

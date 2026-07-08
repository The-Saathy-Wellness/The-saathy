import { NextFunction, Response } from "express";
import { AppError } from "../exceptions/AppError";
import { AuthedRequest } from "../types";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new AppError(401, "UNAUTHENTICATED", "Missing bearer token");
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new AppError(401, "UNAUTHENTICATED", "Invalid or expired token");
  }
};

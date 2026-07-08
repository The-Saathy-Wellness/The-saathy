import { NextFunction, Response } from "express";
import { AuthedRequest } from "../types";
import { verifyAccessToken } from "../utils/jwt";

export const optionalAuth = (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    next();
    return;
  }

  try {
    req.user = verifyAccessToken(token);
  } catch {
    // Anonymous chat must continue even if a stale token is present.
  }
  next();
};

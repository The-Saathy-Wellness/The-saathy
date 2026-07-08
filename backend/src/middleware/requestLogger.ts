import { NextFunction, Response } from "express";
import { v4 as uuid } from "uuid";
import { AuthedRequest } from "../types";

export const requestLogger = (req: AuthedRequest, res: Response, next: NextFunction) => {
  req.requestId = uuid();
  res.setHeader("x-request-id", req.requestId);
  next();
};

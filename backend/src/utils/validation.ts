import { Request } from "express";
import { z } from "zod";
import { AppError } from "../exceptions/AppError";

export const validateBody = <T extends z.ZodTypeAny>(schema: T, req: Request): z.output<T> => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }
  return parsed.data;
};

export const validateQuery = <T extends z.ZodTypeAny>(schema: T, req: Request): z.output<T> => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid query params", parsed.error.flatten());
  }
  return parsed.data;
};

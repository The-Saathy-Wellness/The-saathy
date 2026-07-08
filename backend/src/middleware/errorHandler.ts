import { ErrorRequestHandler } from "express";
import { AppError } from "../exceptions/AppError";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      details: env.NODE_ENV === "development" ? String(error?.stack ?? error) : undefined,
    },
  });
};

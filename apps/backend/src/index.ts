import cors from "cors";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRouter from "./api/auth/auth.routes.js";
import aiRouter from "./api/ai/ai.routes.js";
import wellnessRouter from "./api/wellness/wellness.routes.js";

const app = express();
const port = env.PORT;

app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// REST Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/wellness", wellnessRouter);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "saathy-backend",
    status: "healthy",
  });
});

// Centralized error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  return res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  });
});

app.listen(port, () => {
  console.log(`Saathy backend listening on http://localhost:${port}`);
});


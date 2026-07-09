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
const allowedOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
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
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const error = err instanceof Error ? err : new Error("An unexpected error occurred");
  const status = typeof err === "object" && err !== null && "status" in err && typeof err.status === "number"
    ? err.status
    : 500;
  const code = typeof err === "object" && err !== null && "code" in err && typeof err.code === "string"
    ? err.code
    : "INTERNAL_SERVER_ERROR";

  console.error("Unhandled error:", err);
  return res.status(status).json({
    error: {
      code,
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Saathy backend listening on http://localhost:${port}`);
});


import { Request, Response, NextFunction } from "express";
import { jwtVerify, decodeProtectedHeader, createRemoteJWKSet } from "jose";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Initialize Remote JWKS client for asymmetric algorithms (e.g. ES256)
const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
  {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
    },
  }
);

const JWT_SECRET_BYTES = new TextEncoder().encode(env.JWT_SECRET);

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authorization bearer token is missing or invalid",
        },
      });
    }

    const token = authHeader.split(" ")[1];
    let payload;

    try {
      const header = decodeProtectedHeader(token);
      if (header.alg === "ES256" || header.alg === "RS256") {
        const verified = await jwtVerify(token, JWKS);
        payload = verified.payload;
      } else {
        const verified = await jwtVerify(token, JWT_SECRET_BYTES);
        payload = verified.payload;
      }
    } catch (err) {
      console.error("JWT signature verification failed:", err);
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Session expired or token verification failed",
        },
      });
    }

    if (!payload || !payload.sub) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid token payload",
        },
      });
    }

    // Attach verified user claims to request
    req.user = {
      id: payload.sub,
      email: payload.email as string | undefined,
      phone: payload.phone as string | undefined,
      role: payload.role as string | undefined,
    };

    try {
      // Attempt to load the user's custom database profile.
      const profileResult = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub))
        .limit(1);

      if (profileResult.length > 0) {
        // Convert database row to UserProfile format if needed
        const rawProfile = profileResult[0];
        req.profile = {
          id: rawProfile.id,
          nickname: rawProfile.nickname,
          phoneHash: rawProfile.phoneHash,
          emailHash: rawProfile.emailHash,
          age: rawProfile.age,
          language: rawProfile.language,
          city: rawProfile.city,
          gender: rawProfile.gender,
          isAnonymous: rawProfile.isAnonymous ?? false,
          reasonForJoining: rawProfile.reasonForJoining,
          supportStyle: rawProfile.supportStyle as "listening" | "advice" | "mixed" | null,
          vulnerabilityLevel: rawProfile.vulnerabilityLevel ?? 1,
          riskLevel: rawProfile.riskLevel ?? "standard",
          planId: rawProfile.planId,
          listenerPreferenceId: null,
          showingUpStreak: rawProfile.showingUpStreak ?? 0,
          trustScore: rawProfile.trustScore ?? 0,
          isActive: rawProfile.isActive ?? true,
          createdAt: rawProfile.createdAt?.toISOString(),
          deletedAt: rawProfile.deletedAt?.toISOString() || null,
        };
      }
    } catch (profileError) {
      console.warn("Profile lookup skipped; database is unavailable:", profileError);
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Session expired or token verification failed",
      },
    });
  }
}

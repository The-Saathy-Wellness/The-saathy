import { Request, Response, NextFunction } from "express";
import { db } from "../db/client.js";
import { currentConsent } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

export async function hasConsent(userId: string, consentType: string): Promise<boolean> {
  const consentResult = await db
    .select()
    .from(currentConsent)
    .where(
      and(
        eq(currentConsent.userId, userId),
        eq(currentConsent.consentType, consentType)
      )
    )
    .limit(1);

  return consentResult.length > 0 && consentResult[0].status === "granted";
}

/**
 * Middleware factory to gate endpoints based on current user consent ledger status.
 * @param consentType The consent identifier to check (e.g. 'memory_storage', 'session_summary').
 */
export function requireConsent(consentType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required to check consent",
        },
      });
    }

    try {
      if (!await hasConsent(userId, consentType)) {
        return res.status(403).json({
          error: {
            code: "CONSENT_REQUIRED",
            message: `Active consent for '${consentType}' is required to access this resource`,
            field: consentType,
          },
        });
      }

      next();
    } catch (error) {
      console.error("Consent check error:", error);
      return res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify user consent ledger status",
        },
      });
    }
  };
}

import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { requireAuth } from "../../middleware/auth.js";
import { SyncProfileSchema } from "@saathy/shared";
import { db } from "../../db/client.js";
import { users, consentLedger, guestSessions, continuityEvents } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Reusable SHA-256 hashing helper for E164 phone and normalized email
function sha256(val: string): string {
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

const CONSENT_TYPES = [
  "memory_storage",
  "session_summary",
  "voice_to_text",
  "listener_context_share",
  "crisis_review",
  "notifications",
  "ai_training",
] as const;

/**
 * POST /api/v1/auth/sync
 * Synchronizes the authenticated Supabase user profile to the local database,
 * initializing default consent ledger entries if this is a first-time sign-in.
 * Supports both regular and anonymous (guest) users.
 */
router.post("/sync", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabaseUser = req.user;
    if (!supabaseUser) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "User context not found on request",
        },
      });
    }

    // Validate body payload against shared Zod schema
    const parsed = SyncProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid sync profile payload",
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const payload = parsed.data;
    const userId = supabaseUser.id;
    const isAnonymous = payload.isAnonymous ?? false;

    // Check if the user already has a row in our custom users table
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const emailHash = payload.email ? sha256(payload.email) : (supabaseUser.email ? sha256(supabaseUser.email) : null);
    const phoneHash = payload.phone ? sha256(payload.phone) : (supabaseUser.phone ? sha256(supabaseUser.phone) : null);

    let profile;

    if (existingUsers.length === 0) {
      // First-time login: Insert user row
      // Require onboarding fields for all users (both regular and guest)
      if (!payload.nickname || !payload.age || !payload.language) {
        return res.status(400).json({
          error: {
            code: "ONBOARDING_REQUIRED",
            message: "Nickname, age, and language are required for first-time registration",
          },
        });
      }

      const [newProfile] = await db
        .insert(users)
        .values({
          id: userId,
          nickname: payload.nickname || "Saathy Friend",
          emailHash,
          phoneHash,
          age: payload.age || 18,
          language: payload.language || "en",
          city: payload.city,
          gender: payload.gender,
          reasonForJoining: payload.reasonForJoining,
          supportStyle: payload.supportStyle,
          isAnonymous,
          isActive: true,
        })
        .returning();

      profile = newProfile;

      // Seed initial consent ledger (immutable append-only rows)
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const ipHash = ip ? sha256(ip) : null;

      const ledgerInserts = CONSENT_TYPES.map((type) => {
        // Use provided status or default to revoked
        const status = payload.consents?.[type] || "revoked";
        return {
          userId,
          consentType: type,
          status,
          source: "signup" as const,
          ipHash,
        };
      });

      await db.insert(consentLedger).values(ledgerInserts);
    } else {
      // Returning user: Update profile properties only if updates are provided
      const hasUpdates = 
        payload.nickname !== undefined ||
        payload.age !== undefined ||
        payload.language !== undefined ||
        payload.city !== undefined ||
        payload.gender !== undefined ||
        payload.reasonForJoining !== undefined ||
        payload.supportStyle !== undefined;

      let updatedProfile = existingUsers[0];
      if (hasUpdates) {
        const updateFields: any = {};
        if (payload.nickname !== undefined) updateFields.nickname = payload.nickname;
        if (payload.age !== undefined) updateFields.age = payload.age;
        if (payload.language !== undefined) updateFields.language = payload.language;
        if (payload.city !== undefined) updateFields.city = payload.city;
        if (payload.gender !== undefined) updateFields.gender = payload.gender;
        if (payload.reasonForJoining !== undefined) updateFields.reasonForJoining = payload.reasonForJoining;
        if (payload.supportStyle !== undefined) updateFields.supportStyle = payload.supportStyle;

        const [dbUpdated] = await db
          .update(users)
          .set(updateFields)
          .where(eq(users.id, userId))
          .returning();
        updatedProfile = dbUpdated;
      }

      profile = updatedProfile;

      // Append changes to the consent ledger if specified
      if (payload.consents) {
        const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
        const ipHash = ip ? sha256(ip) : null;

        const ledgerInserts = [];
        for (const type of CONSENT_TYPES) {
          const newStatus = payload.consents[type];
          if (newStatus) {
            ledgerInserts.push({
              userId,
              consentType: type,
              status: newStatus,
              source: "settings" as const,
              ipHash,
            });
          }
        }

        if (ledgerInserts.length > 0) {
          await db.insert(consentLedger).values(ledgerInserts);
        }
      }
    }

    // Format output envelope following response standard
    return res.status(200).json({
      data: {
        profile: {
          id: profile.id,
          nickname: profile.nickname,
          emailHash: profile.emailHash,
          phoneHash: profile.phoneHash,
          age: profile.age,
          language: profile.language,
          city: profile.city,
          gender: profile.gender,
          supportStyle: profile.supportStyle,
          isAnonymous: profile.isAnonymous,
          vulnerabilityLevel: profile.vulnerabilityLevel,
          showingUpStreak: profile.showingUpStreak,
          trustScore: profile.trustScore,
          isActive: profile.isActive,
          createdAt: profile.createdAt?.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error syncing user authentication profile:", error);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to synchronize profile with local database",
      },
    });
  }
});

// --- Guest Continuity Endpoints ---

const FingerprintCheckSchema = z.object({
  deviceFingerprint: z.string().min(1).max(128),
});

/**
 * POST /api/v1/auth/continuity/fingerprint-check
 * Checks if the given device fingerprint matches an existing guest session.
 */
router.post("/continuity/fingerprint-check", requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = FingerprintCheckSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid fingerprint payload" },
      });
    }

    const { deviceFingerprint } = parsed.data;

    const matchingSessions = await db
      .select()
      .from(guestSessions)
      .where(eq(guestSessions.deviceFingerprint, deviceFingerprint))
      .limit(1);

    if (matchingSessions.length > 0) {
      const session = matchingSessions[0];
      return res.status(200).json({
        data: {
          found: true,
          guestSessionId: session.guestSessionId,
          isEphemeral: session.isEphemeral,
          warningDismissed: session.warningDismissed,
          isActive: session.isActive,
          createdAt: session.createdAt?.toISOString(),
        },
      });
    }

    return res.status(200).json({ data: { found: false } });
  } catch (error) {
    console.error("Error checking fingerprint:", error);
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to check fingerprint" },
    });
  }
});

const ContinuityEventSchema = z.object({
  eventType: z.enum([
    "incognito_warning",
    "clear_warning",
    "cross_device_warning",
    "restore_session",
    "dismiss_warning",
  ]),
  guestSessionId: z.string().max(255).optional(),
  deviceHint: z.string().optional(),
});

/**
 * POST /api/v1/auth/continuity/event
 * Records a continuity event (e.g. warning shown, dismissed, or session restored).
 */
router.post("/continuity/event", requireAuth, async (req: Request, res: Response) => {
  try {
    const supabaseUser = req.user;
    if (!supabaseUser) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "User context not found" },
      });
    }

    const parsed = ContinuityEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid event payload" },
      });
    }

    const { eventType, guestSessionId, deviceHint } = parsed.data;

    const [event] = await db
      .insert(continuityEvents)
      .values({
        userId: supabaseUser.id,
        eventType,
        guestSessionId: guestSessionId || null,
        deviceHint: deviceHint || null,
      })
      .returning();

    return res.status(201).json({ data: { event } });
  } catch (error) {
    console.error("Error recording continuity event:", error);
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to record event" },
    });
  }
});

const UpdateFingerprintSchema = z.object({
  deviceFingerprint: z.string().min(1).max(128),
  isEphemeral: z.boolean().optional(),
  deviceHint: z.string().optional(),
});

/**
 * PATCH /api/v1/auth/continuity/update-fingerprint
 * Associates (or updates) a device fingerprint with the active guest user's session.
 * Creates a guest_sessions row if none exists for this Supabase user.
 */
router.patch("/continuity/update-fingerprint", requireAuth, async (req: Request, res: Response) => {
  try {
    const supabaseUser = req.user;
    if (!supabaseUser) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "User context not found" },
      });
    }

    const parsed = UpdateFingerprintSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid fingerprint payload" },
      });
    }

    const { deviceFingerprint, isEphemeral, deviceHint } = parsed.data;
    const userId = supabaseUser.id;

    // Use the Supabase user ID as the guest session identifier (since userId is a 36-char UUID)
    const guestSessionIdValue = userId;

    // Check if a guest session already exists for this guest session ID
    const existingSessions = await db
      .select()
      .from(guestSessions)
      .where(eq(guestSessions.guestSessionId, guestSessionIdValue))
      .limit(1);

    let session;
    if (existingSessions.length > 0) {
      // Update existing session's fingerprint
      const [updated] = await db
        .update(guestSessions)
        .set({
          deviceFingerprint,
          isEphemeral: isEphemeral ?? existingSessions[0].isEphemeral,
          deviceHint: deviceHint || existingSessions[0].deviceHint,
        })
        .where(eq(guestSessions.guestSessionId, guestSessionIdValue))
        .returning();
      session = updated;
    } else {
      // Create new guest session entry
      const [created] = await db
        .insert(guestSessions)
        .values({
          guestSessionId: guestSessionIdValue,
          deviceFingerprint,
          isEphemeral: isEphemeral ?? false,
          deviceHint: deviceHint || null,
          isActive: true,
        })
        .returning();
      session = created;
    }

    return res.status(200).json({ data: { session } });
  } catch (error) {
    console.error("Error updating fingerprint:", error);
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to update fingerprint" },
    });
  }
});

export default router;

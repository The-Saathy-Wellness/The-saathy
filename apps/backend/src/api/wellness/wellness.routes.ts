import { Router, Request, Response } from "express";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "../../middleware/auth.js";
import { db } from "../../db/client.js";
import {
  circles,
  dailyPulse,
  journalEntries,
  listeners,
  saathyMemory,
} from "../../db/schema.js";
import { decryptField, encryptField } from "../../utils/encryption.js";

const router = Router();

const JournalSchema = z.object({
  content: z.string().min(1).max(10000),
  moodTags: z.array(z.string().min(1).max(40)).max(10).optional(),
});

const DailyPulseSchema = z.object({
  moodScore: z.number().int().min(1).max(10),
  lonelinessScore: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(5),
  oneWord: z.string().max(40).optional(),
  note: z.string().max(4000).optional(),
});

router.get("/memory", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const rows = await db
      .select()
      .from(saathyMemory)
      .where(eq(saathyMemory.userId, userId))
      .orderBy(desc(saathyMemory.createdAt))
      .limit(50);

    const memories = rows.map((memory) => ({
      id: memory.id,
      memoryType: memory.memoryType,
      content: decryptField(memory.contentEnc),
      generatedBy: memory.generatedBy,
      isActive: memory.isActive,
      createdAt: memory.createdAt?.toISOString(),
    }));

    return res.status(200).json({ data: { memories } });
  } catch (error) {
    console.error("Memory load error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load memories" } });
  }
});

router.post("/journal", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const parsed = JournalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid journal payload",
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId,
        contentEnc: encryptField(parsed.data.content),
        moodTags: parsed.data.moodTags || [],
        isVoice: false,
      })
      .returning();

    return res.status(201).json({
      data: {
        entry: {
          id: entry.id,
          moodTags: entry.moodTags,
          createdAt: entry.createdAt?.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Journal create error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to save journal" } });
  }
});

router.get("/journal", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const rows = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(50);

    const entries = rows.map((entry) => ({
      id: entry.id,
      content: decryptField(entry.contentEnc),
      moodTags: entry.moodTags,
      aiReflection: entry.aiReflection,
      createdAt: entry.createdAt?.toISOString(),
    }));

    return res.status(200).json({ data: { entries } });
  } catch (error) {
    console.error("Journal load error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load journal" } });
  }
});

router.post("/daily-pulse", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const parsed = DailyPulseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid daily pulse payload",
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const tinyAction = parsed.data.moodScore <= 4
      ? "Try one small grounding action: drink water, breathe slowly, and message someone safe."
      : "Keep the momentum gentle: name one thing that helped today and repeat it tomorrow.";

    const [pulse] = await db
      .insert(dailyPulse)
      .values({
        userId,
        moodScore: parsed.data.moodScore,
        lonelinessScore: parsed.data.lonelinessScore,
        energyLevel: parsed.data.energyLevel,
        oneWord: parsed.data.oneWord,
        noteEnc: parsed.data.note ? encryptField(parsed.data.note) : null,
        tinyAction,
      })
      .returning();

    return res.status(201).json({ data: { pulse } });
  } catch (error) {
    console.error("Daily pulse create error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to save daily pulse" } });
  }
});

router.get("/daily-pulse", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const rows = await db
      .select()
      .from(dailyPulse)
      .where(eq(dailyPulse.userId, userId))
      .orderBy(desc(dailyPulse.recordedAt))
      .limit(30);

    const pulses = rows.map((pulse) => ({
      ...pulse,
      note: pulse.noteEnc ? decryptField(pulse.noteEnc) : null,
      noteEnc: undefined,
    }));

    return res.status(200).json({ data: { pulses } });
  } catch (error) {
    console.error("Daily pulse load error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load daily pulse" } });
  }
});

router.get("/listeners", requireAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(listeners)
      .where(eq(listeners.isActive, true))
      .orderBy(desc(listeners.verified), desc(listeners.ratingAvg))
      .limit(30);

    return res.status(200).json({ data: { listeners: rows } });
  } catch (error) {
    console.error("Listeners load error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load listeners" } });
  }
});

router.get("/circles", requireAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(circles)
      .orderBy(desc(circles.healthScore))
      .limit(30);

    return res.status(200).json({ data: { circles: rows } });
  } catch (error) {
    console.error("Circles load error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load circles" } });
  }
});

export default router;


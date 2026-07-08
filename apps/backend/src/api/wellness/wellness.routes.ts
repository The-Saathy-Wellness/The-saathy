import { Router, Request, Response } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
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

const MemorySchema = z.object({
  memoryType: z.enum(["current_concern", "emotional_pattern", "support_preference", "boundary", "follow_up"]),
  content: z.string().min(1).max(2000),
});

const JournalSchema = z.object({
  content: z.string().min(1).max(10000),
  moodTags: z.array(z.string().min(1).max(40)).max(10).default([]),
});

const DailyPulseSchema = z.object({
  moodScore: z.number().int().min(1).max(10),
  lonelinessScore: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(5),
  oneWord: z.string().max(40).optional(),
  note: z.string().max(4000).optional(),
});

function userIdFrom(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return null;
  }
  return userId;
}

function tinyActionFor(input: z.infer<typeof DailyPulseSchema>): string {
  if (input.lonelinessScore >= 8) {
    return "Send one honest message to someone safe: 'Can you talk for five minutes today?'";
  }
  if (input.moodScore <= 4) {
    return "Try one small grounding action: drink water, breathe slowly, and message someone safe.";
  }
  if (input.energyLevel <= 2) {
    return "Choose the smallest possible task and let that be enough for today.";
  }
  return "Keep the momentum gentle: name one thing that helped today and repeat it tomorrow.";
}

router.post("/memory", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

    const parsed = MemorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } });
    }

    const [memory] = await db
      .insert(saathyMemory)
      .values({
        userId,
        memoryType: parsed.data.memoryType,
        contentEnc: encryptField(parsed.data.content),
        generatedBy: "user",
        isActive: true,
      })
      .returning();

    return res.status(201).json({ data: { memory } });
  } catch (error) {
    console.error("Create memory error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to save memory" } });
  }
});

router.get("/memory", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

    const rows = await db
      .select()
      .from(saathyMemory)
      .where(and(eq(saathyMemory.userId, userId), eq(saathyMemory.isActive, true)))
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

async function createJournal(req: Request, res: Response) {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

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

    const aiReflection = parsed.data.content.length > 40
      ? "You gave language to something real. Come back to this entry when you want to notice the pattern more clearly."
      : "Short reflections count too.";

    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId,
        contentEnc: encryptField(parsed.data.content),
        moodTags: parsed.data.moodTags,
        isVoice: false,
        aiReflection,
      })
      .returning();

    return res.status(201).json({
      data: {
        entry: {
          id: entry.id,
          moodTags: entry.moodTags,
          aiReflection: entry.aiReflection,
          createdAt: entry.createdAt?.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Journal create error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to save journal" } });
  }
}

async function listJournals(req: Request, res: Response) {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

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
}

router.post("/journal", requireAuth, createJournal);
router.post("/journals", requireAuth, createJournal);
router.get("/journal", requireAuth, listJournals);
router.get("/journals", requireAuth, listJournals);

router.post("/daily-pulse", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

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

    const [pulse] = await db
      .insert(dailyPulse)
      .values({
        userId,
        moodScore: parsed.data.moodScore,
        lonelinessScore: parsed.data.lonelinessScore,
        energyLevel: parsed.data.energyLevel,
        oneWord: parsed.data.oneWord,
        noteEnc: parsed.data.note ? encryptField(parsed.data.note) : null,
        tinyAction: tinyActionFor(parsed.data),
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
    const userId = userIdFrom(req, res);
    if (!userId) return;

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

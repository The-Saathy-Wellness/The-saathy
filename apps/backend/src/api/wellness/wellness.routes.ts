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
  content: z.string().min(1).max(6000),
  moodTags: z.array(z.string().min(1).max(40)).default([]),
});

const DailyPulseSchema = z.object({
  moodScore: z.number().int().min(1).max(10),
  lonelinessScore: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(5),
  oneWord: z.string().max(40).optional(),
  note: z.string().max(1000).optional(),
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
  if (input.moodScore <= 3) {
    return "Do one grounding reset: drink water, step outside, and name five things you can see.";
  }
  if (input.energyLevel <= 2) {
    return "Choose the smallest possible task and let that be enough for today.";
  }
  return "Notice one thing that helped today and write it down before sleep.";
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
      .limit(25);

    const memories = rows.map((row) => ({
      ...row,
      content: decryptField(row.contentEnc),
      contentEnc: undefined,
    }));

    return res.status(200).json({ data: { memories } });
  } catch (error) {
    console.error("List memory error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load memory" } });
  }
});

router.post("/journals", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

    const parsed = JournalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } });
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
        aiReflection,
      })
      .returning();

    return res.status(201).json({ data: { entry } });
  } catch (error) {
    console.error("Create journal error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to save journal" } });
  }
});

router.get("/journals", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

    const rows = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(30);

    const entries = rows.map((row) => ({
      ...row,
      content: decryptField(row.contentEnc),
      contentEnc: undefined,
    }));

    return res.status(200).json({ data: { entries } });
  } catch (error) {
    console.error("List journals error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load journals" } });
  }
});

router.post("/daily-pulse", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = userIdFrom(req, res);
    if (!userId) return;

    const parsed = DailyPulseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } });
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
    console.error("Create daily pulse error:", error);
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
      .limit(14);

    return res.status(200).json({ data: { pulses: rows } });
  } catch (error) {
    console.error("List daily pulse error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load daily pulse" } });
  }
});

router.get("/listeners", requireAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(listeners)
      .where(eq(listeners.isActive, true))
      .limit(25);

    return res.status(200).json({ data: { listeners: rows } });
  } catch (error) {
    console.error("List listeners error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load listeners" } });
  }
});

router.get("/circles", requireAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(circles).limit(25);
    return res.status(200).json({ data: { circles: rows } });
  } catch (error) {
    console.error("List circles error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load circles" } });
  }
});

export default router;

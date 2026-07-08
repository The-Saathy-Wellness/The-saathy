import { Router, Request, Response } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { requireAuth } from "../../middleware/auth.js";
import { db } from "../../db/client.js";
import {
  aiChatMessages,
  crisisFlags,
  saathyMemory,
  sessions,
} from "../../db/schema.js";
import { decryptField, encryptField } from "../../utils/encryption.js";
import { assessSafety, crisisResponse } from "../../services/safety.js";
import { generateCompanionReply } from "../../services/aiProvider.js";

const router = Router();

const ChatMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().uuid().optional(),
});

function buildSystemPrompt(memories: string[]): string {
  const memoryBlock = memories.length > 0
    ? `Known user context, shared only because memory consent exists:\n- ${memories.join("\n- ")}`
    : "No prior memory context is available.";

  return [
    "You are Saathy, a warm emotional wellness companion.",
    "You are not therapy, medical care, dating, or emergency response.",
    "Listen with care, ask one useful follow-up question, avoid diagnosis, and keep responses concise.",
    "For crisis or self-harm content, prioritize immediate human/emergency support.",
    memoryBlock,
  ].join("\n");
}

function maybeExtractMemory(message: string): string | null {
  const lower = message.toLowerCase();
  if (
    lower.includes("i prefer") ||
    lower.includes("remember") ||
    lower.includes("i feel") ||
    lower.includes("i'm feeling") ||
    lower.includes("i am feeling")
  ) {
    return message.slice(0, 700);
  }

  return null;
}

router.post("/chat", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const parsed = ChatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid chat payload",
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const { message, sessionId } = parsed.data;
    const safety = assessSafety(message);

    let activeSessionId = sessionId;
    if (activeSessionId) {
      const ownedSessions = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(and(eq(sessions.id, activeSessionId), eq(sessions.userId, userId)))
        .limit(1);

      if (ownedSessions.length === 0) {
        return res.status(404).json({ error: { code: "SESSION_NOT_FOUND", message: "Chat session not found" } });
      }
    } else {
      const [createdSession] = await db
        .insert(sessions)
        .values({
          userId,
          sessionType: "ai_chat",
          status: "active",
          crisisFlag: safety.riskLevel === "critical",
        })
        .returning();
      activeSessionId = createdSession.id;
    }

    await db.insert(aiChatMessages).values({
      sessionId: activeSessionId,
      userId,
      role: "user",
      contentEnc: encryptField(message),
      riskLevel: safety.riskLevel,
    });

    if (safety.shouldEscalate && safety.flagType !== "none") {
      await db.insert(crisisFlags).values({
        userId,
        sessionId: activeSessionId,
        flagType: safety.flagType,
        triggerText: message.slice(0, 500),
        resolution: "helpline_shown",
      });
    }

    const memoryRows = await db
      .select()
      .from(saathyMemory)
      .where(and(eq(saathyMemory.userId, userId), eq(saathyMemory.isActive, true)))
      .orderBy(desc(saathyMemory.createdAt))
      .limit(5);

    const memories = memoryRows.flatMap((memory) => {
      try {
        return [decryptField(memory.contentEnc)];
      } catch {
        return [];
      }
    });

    const assistantText = safety.shouldEscalate
      ? crisisResponse()
      : await generateCompanionReply({
          systemPrompt: buildSystemPrompt(memories),
          userMessage: message,
        });

    await db.insert(aiChatMessages).values({
      sessionId: activeSessionId,
      userId,
      role: "assistant",
      contentEnc: encryptField(assistantText),
      riskLevel: safety.riskLevel,
    });

    const extractedMemory = safety.riskLevel === "standard" ? maybeExtractMemory(message) : null;
    if (extractedMemory) {
      await db.insert(saathyMemory).values({
        userId,
        memoryType: "current_concern",
        contentEnc: encryptField(extractedMemory),
        generatedBy: "user",
        sessionId: activeSessionId,
        isActive: true,
      });
    }

    return res.status(200).json({
      data: {
        sessionId: activeSessionId,
        reply: assistantText,
        safety: {
          riskLevel: safety.riskLevel,
          shouldEscalate: safety.shouldEscalate,
        },
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to process chat message",
      },
    });
  }
});

router.get("/sessions", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const rows = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), eq(sessions.sessionType, "ai_chat")))
      .orderBy(desc(sessions.startedAt))
      .limit(20);

    return res.status(200).json({ data: { sessions: rows } });
  } catch (error) {
    console.error("AI sessions error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load sessions" } });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { z } from "zod";
import { and, asc, desc, eq } from "drizzle-orm";
import { requireAuth } from "../../middleware/auth.js";
import { hasConsent, requireConsent } from "../../middleware/consent.js";
import { db } from "../../db/client.js";
import {
  aiChatMessages,
  crisisFlags,
  saathyMemory,
  sessions,
} from "../../db/schema.js";
import { decryptField, encryptField } from "../../utils/encryption.js";
import { assessSafety, crisisResponse } from "../../services/safety.js";
import { ChatMessage, generateCompanionReply, getAIProviderStatus } from "../../services/aiProvider.js";

const router = Router();

const ChatMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().uuid().optional(),
  tone: z
    .enum([
      "friendly_supportive",
      "advising_practical",
      "motivational",
      "calm_reflective",
      "empathetic_listener",
      "casual",
    ])
    .default("empathetic_listener"),
  temperature: z.number().min(0).max(1.2).optional(),
});

const AnonymousChatSchema = ChatMessageSchema.omit({ sessionId: true });

const toneInstructions: Record<z.infer<typeof ChatMessageSchema>["tone"], string> = {
  friendly_supportive: "Use a warm, affirming, gently hopeful tone.",
  advising_practical: "Be grounded and practical. Offer one clear next step after listening.",
  motivational: "Be energizing and forward-moving without dismissing pain.",
  calm_reflective: "Use a slow, spacious, reflective style. Ask thoughtful questions.",
  empathetic_listener: "Be deeply present, non-judgmental, and emotionally attuned.",
  casual: "Be easygoing and conversational while remaining safe and caring.",
};

function buildSystemPrompt(memories: string[], tone: z.infer<typeof ChatMessageSchema>["tone"]): string {
  const memoryBlock = memories.length > 0
    ? `Known user context, shared only because memory consent exists:\n- ${memories.join("\n- ")}`
    : "No prior memory context is available.";

  return [
    "You are Saathy, a warm emotional wellness companion.",
    "You are not therapy, medical care, dating, or emergency response.",
    "Listen with care, ask one useful follow-up question, avoid diagnosis, and keep responses concise.",
    "For crisis or self-harm content, prioritize immediate human/emergency support.",
    `Conversation tone: ${toneInstructions[tone]}`,
    memoryBlock,
  ].join("\n");
}

function maybeExtractMemories(message: string): Array<{ memoryType: string; content: string }> {
  const lower = message.toLowerCase();
  const memories: Array<{ memoryType: string; content: string }> = [];

  if (
    lower.includes("i prefer") ||
    lower.includes("i like") ||
    lower.includes("i don't like")
  ) {
    memories.push({ memoryType: "support_preference", content: message.slice(0, 700) });
  }

  if (
    lower.includes("remember") ||
    lower.includes("i feel") ||
    lower.includes("i'm feeling") ||
    lower.includes("i am feeling")
  ) {
    memories.push({ memoryType: "current_concern", content: message.slice(0, 700) });
  }

  if (lower.includes("always") || lower.includes("usually") || lower.includes("every day")) {
    memories.push({ memoryType: "emotional_pattern", content: message.slice(0, 700) });
  }

  if (lower.includes("don't mention") || lower.includes("do not mention") || lower.includes("boundary")) {
    memories.push({ memoryType: "boundary", content: message.slice(0, 700) });
  }

  if (lower.includes("tomorrow") || lower.includes("next week") || lower.includes("follow up")) {
    memories.push({ memoryType: "follow_up", content: message.slice(0, 700) });
  }

  return memories;
}

function decryptMessage(row: typeof aiChatMessages.$inferSelect): ChatMessage & { id: string; createdAt?: string; riskLevel?: string | null } {
  return {
    id: row.id,
    role: row.role === "assistant" ? "assistant" : row.role === "system" ? "system" : "user",
    content: decryptField(row.contentEnc),
    riskLevel: row.riskLevel,
    createdAt: row.createdAt?.toISOString(),
  };
}

async function loadRecentHistory(sessionId: string, userId: string): Promise<ChatMessage[]> {
  const rows = await db
    .select()
    .from(aiChatMessages)
    .where(and(eq(aiChatMessages.sessionId, sessionId), eq(aiChatMessages.userId, userId)))
    .orderBy(desc(aiChatMessages.createdAt))
    .limit(10);

  return rows.reverse().flatMap((row) => {
    try {
      return [decryptMessage(row)];
    } catch {
      return [];
    }
  });
}

router.get("/status", (_req: Request, res: Response) => {
  return res.status(200).json({ data: getAIProviderStatus() });
});

router.post("/anonymous-chat", async (req: Request, res: Response) => {
  try {
    const parsed = AnonymousChatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid anonymous chat payload",
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const { message, tone, temperature } = parsed.data;
    const safety = assessSafety(message);
    const assistantText = safety.shouldEscalate
      ? crisisResponse()
      : await generateCompanionReply({
          systemPrompt: buildSystemPrompt([], tone),
          userMessage: message,
          temperature,
        });

    return res.status(200).json({
      data: {
        reply: assistantText,
        safety: {
          riskLevel: safety.riskLevel,
          shouldEscalate: safety.shouldEscalate,
        },
        persistence: "disabled",
      },
    });
  } catch (error) {
    console.error("Anonymous AI chat error:", error);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to process anonymous chat message",
      },
    });
  }
});

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

    const { message, sessionId, tone, temperature } = parsed.data;
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

    const canUseMemory = await hasConsent(userId, "memory_storage");
    const memoryRows = canUseMemory
      ? await db
          .select()
          .from(saathyMemory)
          .where(and(eq(saathyMemory.userId, userId), eq(saathyMemory.isActive, true)))
          .orderBy(desc(saathyMemory.createdAt))
          .limit(5)
      : [];

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
          systemPrompt: buildSystemPrompt(memories, tone),
          userMessage: message,
          history: await loadRecentHistory(activeSessionId, userId),
          temperature,
        });

    await db.insert(aiChatMessages).values({
      sessionId: activeSessionId,
      userId,
      role: "assistant",
      contentEnc: encryptField(assistantText),
      riskLevel: safety.riskLevel,
    });

    const extractedMemories = canUseMemory && safety.riskLevel === "standard" ? maybeExtractMemories(message) : [];
    if (extractedMemories.length > 0) {
      await db.insert(saathyMemory).values(extractedMemories.map((memory) => ({
        userId,
        memoryType: memory.memoryType,
        contentEnc: encryptField(memory.content),
        generatedBy: "user",
        sessionId: activeSessionId,
        isActive: true,
      })));
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
    const userId = req.user?.id;
    const parsed = ChatMessageSchema.safeParse(req.body);

    if (userId && parsed.success) {
      const safety = assessSafety(parsed.data.message);
      try {
        const assistantText = safety.shouldEscalate
          ? crisisResponse()
          : await generateCompanionReply({
              systemPrompt: buildSystemPrompt([], parsed.data.tone),
              userMessage: parsed.data.message,
              temperature: parsed.data.temperature,
            });

        return res.status(200).json({
          data: {
            sessionId: parsed.data.sessionId ?? null,
            reply: assistantText,
            safety: {
              riskLevel: safety.riskLevel,
              shouldEscalate: safety.shouldEscalate,
            },
            persistence: "disabled",
          },
        });
      } catch (fallbackError) {
        console.error("AI non-persistent fallback error:", fallbackError);
      }
    }

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

router.get("/sessions/:sessionId/messages", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const sessionId = z.string().uuid().safeParse(req.params.sessionId);
    if (!sessionId.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid session id" } });
    }

    const ownedSessions = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(and(eq(sessions.id, sessionId.data), eq(sessions.userId, userId)))
      .limit(1);

    if (ownedSessions.length === 0) {
      return res.status(404).json({ error: { code: "SESSION_NOT_FOUND", message: "Chat session not found" } });
    }

    const rows = await db
      .select()
      .from(aiChatMessages)
      .where(and(eq(aiChatMessages.sessionId, sessionId.data), eq(aiChatMessages.userId, userId)))
      .orderBy(asc(aiChatMessages.createdAt))
      .limit(100);

    const messages = rows.flatMap((row) => {
      try {
        return [decryptMessage(row)];
      } catch {
        return [];
      }
    });

    return res.status(200).json({ data: { messages } });
  } catch (error) {
    console.error("AI messages error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to load messages" } });
  }
});

router.post("/sessions/:sessionId/end", requireAuth, requireConsent("session_summary"), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    }

    const sessionId = z.string().uuid().safeParse(req.params.sessionId);
    if (!sessionId.success) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid session id" } });
    }

    const history = await loadRecentHistory(sessionId.data, userId);
    const summary = history.length > 0
      ? await generateCompanionReply({
          systemPrompt: [
            "Summarize this Saathy chat for continuity.",
            "Use 3 short bullet points: concern, helpful support style, and follow-up.",
            "Do not include medical diagnosis.",
          ].join("\n"),
          userMessage: history.map((message) => `${message.role}: ${message.content}`).join("\n"),
          temperature: 0.2,
          maxTokens: 220,
        })
      : "Session ended before enough conversation existed to summarize.";

    const [session] = await db
      .update(sessions)
      .set({
        status: "ended",
        endedAt: new Date(),
        summaryEnc: encryptField(summary),
      })
      .where(and(eq(sessions.id, sessionId.data), eq(sessions.userId, userId)))
      .returning();

    if (!session) {
      return res.status(404).json({ error: { code: "SESSION_NOT_FOUND", message: "Chat session not found" } });
    }

    return res.status(200).json({ data: { sessionId: session.id, summary } });
  } catch (error) {
    console.error("AI end session error:", error);
    return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to end session" } });
  }
});

export default router;

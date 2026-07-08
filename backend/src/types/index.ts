import { Request } from "express";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AuthUser = {
  id: string;
  email: string;
  role: "user" | "listener" | "admin";
};

export type AuthedRequest = Request & {
  user?: AuthUser;
  requestId?: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ConversationTone =
  | "friendly_supportive"
  | "advising_practical"
  | "motivational"
  | "calm_reflective"
  | "empathetic_listener"
  | "casual";

export type SafetyResult = {
  allowed: boolean;
  riskLevel: RiskLevel;
  categories: string[];
  suggestedResponse?: string;
};

export type Memory = {
  id: string;
  userId: string;
  kind: "preference" | "emotional_pattern" | "important_event" | "follow_up";
  content: string;
  importance: number;
  createdAt: string;
};

import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
  anonymous: z.boolean().default(false),
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
});

import { z } from "zod";

export const ConsentStatusSchema = z.enum(["granted", "revoked", "paused"]);

export const SyncProfileSchema = z.object({
  nickname: z.string().max(60).optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional().nullable(),
  age: z.number().int().min(13, "Must be at least 13 years old").optional(),
  language: z.string().min(2).max(10).optional(),
  city: z.string().max(80).optional().nullable(),
  gender: z.string().max(20).optional().nullable(),
  reasonForJoining: z.string().optional().nullable(),
  supportStyle: z.enum(["listening", "advice", "mixed"]).optional().nullable(),
  isAnonymous: z.boolean().optional(),
  consents: z.object({
    memory_storage: ConsentStatusSchema.optional(),
    session_summary: ConsentStatusSchema.optional(),
    voice_to_text: ConsentStatusSchema.optional(),
    listener_context_share: ConsentStatusSchema.optional(),
    crisis_review: ConsentStatusSchema.optional(),
    notifications: ConsentStatusSchema.optional(),
    ai_training: ConsentStatusSchema.optional(),
  }).optional(),
});

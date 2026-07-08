import { z } from "zod";

export const journalSchema = z.object({
  content: z.string().min(1).max(6000),
  mood: z.string().optional(),
});

export const pulseSchema = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(10),
  stress: z.number().int().min(1).max(10),
  loneliness: z.number().int().min(1).max(10),
  note: z.string().max(1000).optional(),
});

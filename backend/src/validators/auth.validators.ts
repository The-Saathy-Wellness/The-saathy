import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  ageRange: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
  moods: z.array(z.string()).default([]),
  termsAccepted: z.boolean().refine(Boolean, "Terms must be accepted"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  ageRange: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
  moods: z.array(z.string()).optional(),
});

import { z } from "zod";

export const createOrderSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3).default("INR"),
  receipt: z.string().optional(),
});

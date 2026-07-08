import { z } from "zod";

export const matchListenerSchema = z.object({
  language: z.string().optional(),
  topic: z.string().optional(),
});

export const callTokenSchema = z.object({
  roomName: z.string().min(1),
  participantName: z.string().min(1),
});

import { Response } from "express";
import { AIService } from "../services/ai.service";
import { AuthedRequest } from "../types";
import { validateBody } from "../utils/validation";
import { chatSchema } from "../validators/ai.validators";

const ai = new AIService();

export const chat = async (req: AuthedRequest, res: Response) => {
  const body = validateBody(chatSchema, req);
  res.json(await ai.chat({ ...body, userId: req.user?.id }));
};

import { Response } from "express";
import { AppError } from "../exceptions/AppError";
import { WellnessService } from "../services/wellness.service";
import { AuthedRequest } from "../types";
import { validateBody } from "../utils/validation";
import { journalSchema, pulseSchema } from "../validators/wellness.validators";

const wellness = new WellnessService();

const userId = (req: AuthedRequest) => {
  if (!req.user) throw new AppError(401, "UNAUTHENTICATED", "Missing authenticated user");
  return req.user.id;
};

export const createJournal = async (req: AuthedRequest, res: Response) => {
  const body = validateBody(journalSchema, req);
  res.status(201).json(await wellness.createJournal(userId(req), body));
};

export const listJournals = async (req: AuthedRequest, res: Response) => {
  res.json(await wellness.listJournals(userId(req)));
};

export const createPulse = async (req: AuthedRequest, res: Response) => {
  const body = validateBody(pulseSchema, req);
  res.status(201).json(await wellness.createPulse(userId(req), body));
};

export const pulseSummary = async (req: AuthedRequest, res: Response) => {
  res.json(await wellness.pulseSummary(userId(req)));
};

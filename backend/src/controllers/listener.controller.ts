import { Request, Response } from "express";
import { CallService } from "../services/call.service";
import { ListenerService } from "../services/listener.service";
import { validateBody } from "../utils/validation";
import { callTokenSchema, matchListenerSchema } from "../validators/listener.validators";

const listeners = new ListenerService();
const calls = new CallService();

export const matchListener = async (req: Request, res: Response) => {
  const body = validateBody(matchListenerSchema, req);
  res.json(await listeners.match(body));
};

export const createCallToken = async (req: Request, res: Response) => {
  const body = validateBody(callTokenSchema, req);
  res.json(await calls.createLiveKitToken(body));
};

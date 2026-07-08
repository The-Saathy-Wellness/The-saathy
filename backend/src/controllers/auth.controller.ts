import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { validateBody } from "../utils/validation";
import { loginSchema, registerSchema } from "../validators/auth.validators";

const auth = new AuthService();

export const register = async (req: Request, res: Response) => {
  const body = validateBody(registerSchema, req);
  res.status(201).json(await auth.register(body));
};

export const login = async (req: Request, res: Response) => {
  const body = validateBody(loginSchema, req);
  res.json(await auth.login(body));
};

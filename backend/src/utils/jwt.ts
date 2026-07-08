import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthUser } from "../types";

export const signAccessToken = (user: AuthUser) =>
  jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as AuthUser;

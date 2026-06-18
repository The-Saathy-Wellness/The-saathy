import { UserProfile } from "@saathy/shared";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Supabase user UUID (from 'sub' claim)
        email?: string;
        phone?: string;
        role?: string;
      };
      profile?: UserProfile; // local custom db user profile
    }
  }
}

import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Initialize the Supabase Client with the Service Role key
// This allows the backend to perform administrative database operations (bypassing RLS where necessary)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

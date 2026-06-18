import { createClient } from "@supabase/supabase-js";

// Load environment variables for Supabase connection
// Fallback to dummy strings in development if environment variables are not yet injected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mockproject.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

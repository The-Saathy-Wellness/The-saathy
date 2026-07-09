import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

const shouldUseSupabaseSsl = env.DATABASE_URL.includes("supabase.com");

// Database Connection Pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: shouldUseSupabaseSsl ? { rejectUnauthorized: false } : undefined,
});

// Initialize Drizzle ORM client
export const db = drizzle(pool, { schema });

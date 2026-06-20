import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

// Database Connection Pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize Drizzle ORM client
export const db = drizzle(pool, { schema });

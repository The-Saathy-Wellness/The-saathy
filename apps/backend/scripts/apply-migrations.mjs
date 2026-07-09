import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const drizzleDir = resolve(root, "drizzle");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required to apply migrations.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("supabase.com") ? { rejectUnauthorized: false } : undefined,
});

async function tableExists(tableName) {
  const result = await pool.query(
    "select exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = $1)",
    [tableName],
  );
  return result.rows[0]?.exists === true;
}

async function runSqlFile(fileName, { skipIfUsersExists = false } = {}) {
  if (skipIfUsersExists && await tableExists("users")) {
    console.log(`Skipping ${fileName}; base tables already exist.`);
    return;
  }

  const sql = await readFile(resolve(drizzleDir, fileName), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await pool.query(statement);
    } catch (error) {
      if (["42701", "42710", "42P07"].includes(error.code)) {
        console.log(`Skipping existing object in ${fileName}: ${error.code}`);
        continue;
      }
      throw error;
    }
  }

  console.log(`Applied ${fileName}.`);
}

try {
  await pool.query("select 1");
  await runSqlFile("0000_productive_argent.sql", { skipIfUsersExists: true });
  await runSqlFile("0002_mvp_backend_ai.sql");

  const result = await pool.query(
    "select table_name from information_schema.tables where table_schema = 'public' and table_name in ('users', 'sessions', 'ai_chat_messages') order by table_name",
  );
  console.log(`Ready tables: ${result.rows.map((row) => row.table_name).join(", ")}`);
} catch (error) {
  if (error.code === "28P01") {
    console.error("DATABASE_URL authentication failed. Update apps/backend/.env with the correct Supabase database password, then rerun: node scripts/apply-migrations.mjs");
    process.exitCode = 1;
  } else if (error.code === "SELF_SIGNED_CERT_IN_CHAIN") {
    console.error("DATABASE_URL SSL verification failed. The migration runner enables Supabase SSL automatically; check the database host and pooler URL.");
    process.exitCode = 1;
  } else {
    throw error;
  }
} finally {
  await pool.end();
}

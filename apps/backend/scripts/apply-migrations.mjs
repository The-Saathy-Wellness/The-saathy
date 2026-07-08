import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const drizzleDir = resolve(root, "drizzle");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
} finally {
  await pool.end();
}

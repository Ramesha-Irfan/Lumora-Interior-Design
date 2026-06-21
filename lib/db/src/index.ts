import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawUrl = process.env.DATABASE_URL;
// When bundled by esbuild, __dirname is artifacts/api-server/dist/
// Going up 1 level finds artifacts/api-server/lumora.db
// When running unbundled from lib/db/src/, going up 1 level finds lib/db/lumora.db
const dbPath = rawUrl ? rawUrl.replace(/^file:/, '') : path.resolve(__dirname, "../lumora.db");

const sqlite = new Database(dbPath);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export const pool = sqlite; // kept for compatibility

export * from "./schema";

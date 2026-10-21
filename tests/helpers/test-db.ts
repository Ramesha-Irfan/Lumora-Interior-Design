import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// SAFETY GUARD: Ensure DATABASE_URL points to a temporary database so lib/db/lumora.db is NEVER touched
if (!process.env.DATABASE_URL) {
  const safetyTmp = path.join(os.tmpdir(), "lumora-safety-default.db");
  process.env.DATABASE_URL = `file:${safetyTmp}`;
}

export const DDL_SCHEMA = `
CREATE TABLE \`users\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`name\` text NOT NULL,
	\`username\` text NOT NULL,
	\`email\` text NOT NULL,
	\`password_hash\` text NOT NULL,
	\`plan\` text DEFAULT 'Free' NOT NULL,
	\`avatar_color\` text DEFAULT '#A78B75' NOT NULL,
	\`is_verified\` integer DEFAULT 0 NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX \`users_username_unique\` ON \`users\` (\`username\`);
CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);

CREATE TABLE \`otp_verifications\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`code\` text NOT NULL,
	\`expires_at\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE \`projects\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`name\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`rooms\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`project_id\` integer NOT NULL,
	\`name\` text NOT NULL,
	\`type\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`designs\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`room_id\` integer NOT NULL,
	\`image_url\` text NOT NULL,
	\`prompt\` text NOT NULL,
	\`style\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`favorites\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`design_id\` integer NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`design_id\`) REFERENCES \`designs\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`histories\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`action\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`password_reset_tokens\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`token\` text NOT NULL,
	\`expires_at\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE \`refresh_tokens\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`user_id\` integer NOT NULL,
	\`token\` text NOT NULL,
	\`expires_at\` text NOT NULL,
	\`created_at\` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
);
`;

export interface TestDbInstance {
  sqlite: Database.Database;
  dbPath: string;
  cleanup: () => void;
}

export function createIsolatedTestDb(): TestDbInstance {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lumora-test-"));
  const dbPath = path.join(tmpDir, "test.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  sqlite.exec(DDL_SCHEMA);

  return {
    sqlite,
    dbPath,
    cleanup: () => {
      try {
        sqlite.close();
      } catch {}
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
    },
  };
}

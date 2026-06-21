import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./users";

export const historiesTable = sqliteTable("histories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  action: text("action").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { projectsTable } from "./projects";

export const roomsTable = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectsTable.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

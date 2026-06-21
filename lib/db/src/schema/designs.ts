import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { roomsTable } from "./rooms";

export const designsTable = sqliteTable("designs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id")
    .notNull()
    .references(() => roomsTable.id),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

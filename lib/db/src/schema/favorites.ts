import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./users";
import { designsTable } from "./designs";

export const favoritesTable = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  designId: integer("design_id")
    .notNull()
    .references(() => designsTable.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

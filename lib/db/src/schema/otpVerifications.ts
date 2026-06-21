import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";
import { sql } from "drizzle-orm";

export const otpVerificationsTable = sqliteTable("otp_verifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export type DbOtpVerification = typeof otpVerificationsTable.$inferSelect;
export type InsertOtpVerification = typeof otpVerificationsTable.$inferInsert;

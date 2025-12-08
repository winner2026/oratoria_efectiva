import { pgTable, text, uuid, timestamp, numeric } from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: text("user_id").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { url } from "inspector";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
    url: text("url").notNull().unique(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
});

export type Feed = typeof feeds.$inferSelect;
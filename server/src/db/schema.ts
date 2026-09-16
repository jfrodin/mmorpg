import { pgTable, text, real, integer, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import type { AppearanceDescriptor } from "shared";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const characters = pgTable("characters", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  x: real("x").notNull().default(0),
  y: real("y").notNull().default(0),
  appearance: jsonb("appearance").$type<AppearanceDescriptor>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: text("id").primaryKey(),
    characterId: text("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    quantity: integer("quantity").notNull().default(0),
  },
  (table) => [unique().on(table.characterId, table.itemId)]
);

export const characterSkills = pgTable(
  "character_skills",
  {
    id: text("id").primaryKey(),
    characterId: text("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "cascade" }),
    skill: text("skill").notNull(),
    xp: integer("xp").notNull().default(0),
  },
  (table) => [unique().on(table.characterId, table.skill)]
);

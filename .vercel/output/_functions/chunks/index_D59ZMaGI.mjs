import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, timestamp, boolean, text, uuid, numeric, integer } from 'drizzle-orm/pg-core';

const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  provider: text("provider").notNull().default("google"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyHash: text("key_hash").notNull().unique(),
  label: text("label").notNull(),
  userId: uuid("user_id"),
  rateLimit: integer("rate_limit").default(60),
  credits: numeric("credits", { precision: 10, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true })
});

const schema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  apiKeys,
  users
}, Symbol.toStringTag, { value: 'Module' }));

const connectionString = "postgresql://postgres.nxwuhwavvyjppmzyfybh:enterprise_maya@aws-1-us-west-1.pooler.supabase.com:5432/postgres";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export { apiKeys as a, db as d };

import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  index,
  uniqueIndex,
  int,
  mediumtext,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const notes = mysqlTable("notes", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>(),
  source: text("source"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// Tlamatini-RC: computers that Tlachihuani connected to xaiht.org, and the
// messages sent to them. The key itself is never stored, only its SHA-256.
// api/rc/store.ts also creates these two tables on first use (same columns),
// so a deploy works before anyone runs drizzle-kit push.
export const rcComputers = mysqlTable(
  "rc_computers",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    tokenHash: varchar("tokenHash", { length: 64 }).notNull().unique(),
    tokenHint: varchar("tokenHint", { length: 16 }).notNull(),
    hostName: varchar("hostName", { length: 255 }),
    clientVersion: varchar("clientVersion", { length: 64 }),
    lastIp: varchar("lastIp", { length: 64 }),
    lastSeenAt: timestamp("lastSeenAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("rc_computers_user_idx").on(table.userId)],
);

export type RcComputer = typeof rcComputers.$inferSelect;

export const rcMessages = mysqlTable(
  "rc_messages",
  {
    id: serial("id").primaryKey(),
    computerId: bigint("computerId", { mode: "number", unsigned: true }).notNull(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    payload: text("payload").notNull(),
    status: mysqlEnum("status", ["queued", "delivered", "acknowledged", "expired"]).default("queued").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    deliveredAt: timestamp("deliveredAt"),
    acknowledgedAt: timestamp("acknowledgedAt"),
  },
  (table) => [
    index("rc_messages_computer_idx").on(table.computerId, table.status),
    index("rc_messages_user_idx").on(table.userId),
  ],
);

export type RcMessage = typeof rcMessages.$inferSelect;

// Durable executable requests use separate rows and state from inert log messages.
export const rcCommands = mysqlTable("rc_commands", {
  id: serial("id").primaryKey(),
  computerId: bigint("computerId", { mode: "number", unsigned: true }).notNull()
    .references(() => rcComputers.id, { onDelete: "cascade" }),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  requestId: varchar("requestId", { length: 32 }).notNull(),
  requestHash: varchar("requestHash", { length: 64 }).notNull(),
  operation: varchar("operation", { length: 40 }).notNull(),
  bindingId: varchar("bindingId", { length: 32 }),
  payload: text("payload").notNull(),
  status: mysqlEnum("status", ["queued", "delivered", "running", "completed", "expired"]).default("queued").notNull(),
  deliveryId: varchar("deliveryId", { length: 32 }),
  sequence: int("sequence", { unsigned: true }).notNull().default(0),
  response: mediumtext("response"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  leaseUntil: timestamp("leaseUntil"),
}, table => [
  uniqueIndex("rc_commands_request_unique").on(table.computerId, table.requestId),
  index("rc_commands_delivery_idx").on(table.computerId, table.status, table.leaseUntil),
  index("rc_commands_owner_idx").on(table.userId, table.computerId, table.createdAt),
]);
export type RcCommand = typeof rcCommands.$inferSelect;
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()

// Tlamatini-RC — Angela López Mendoza · XAIHT
import { and, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { rcComputers, rcMessages, type RcComputer, type RcMessage } from "../../db/schema";

export type { RcComputer, RcMessage };

export type ComputerSeen = { ip: string | null; version: string | null; hostName: string | null };

export interface RcStore {
  createComputer(userId: number, name: string, tokenHash: string, tokenHint: string): Promise<RcComputer>;
  listComputers(userId: number): Promise<RcComputer[]>;
  getComputer(userId: number, id: number): Promise<RcComputer | undefined>;
  removeComputer(userId: number, id: number): Promise<boolean>;
  findComputerByTokenHash(tokenHash: string): Promise<RcComputer | undefined>;
  touchComputer(id: number, seen: ComputerSeen, at: Date): Promise<void>;
  createMessage(computerId: number, userId: number, expiresAt: Date, build: (id: number) => string): Promise<RcMessage>;
  // Queued messages that have not expired, plus delivered ones never acknowledged
  // (given again after redeliverBefore). The returned messages are marked delivered.
  takeDeliverable(computerId: number, now: Date, redeliverBefore: Date): Promise<RcMessage[]>;
  acknowledge(computerId: number, ids: number[], at: Date): Promise<number>;
  listMessages(userId: number, limit: number): Promise<RcMessage[]>;
  countQueued(computerId: number, now: Date): Promise<number>;
}

// The same columns as db/schema.ts, written the way drizzle-kit writes them, so
// a later `drizzle-kit push` finds nothing to change. CREATE ... IF NOT EXISTS
// leaves existing tables untouched.
const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS \`rc_computers\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`userId\` bigint unsigned NOT NULL,
    \`name\` varchar(120) NOT NULL,
    \`tokenHash\` varchar(64) NOT NULL,
    \`tokenHint\` varchar(16) NOT NULL,
    \`hostName\` varchar(255),
    \`clientVersion\` varchar(64),
    \`lastIp\` varchar(64),
    \`lastSeenAt\` timestamp NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`rc_computers_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`rc_computers_tokenHash_unique\` UNIQUE(\`tokenHash\`),
    INDEX \`rc_computers_user_idx\` (\`userId\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`rc_messages\` (
    \`id\` serial AUTO_INCREMENT NOT NULL,
    \`computerId\` bigint unsigned NOT NULL,
    \`userId\` bigint unsigned NOT NULL,
    \`payload\` text NOT NULL,
    \`status\` enum('queued','delivered','acknowledged','expired') NOT NULL DEFAULT 'queued',
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`expiresAt\` timestamp NOT NULL,
    \`deliveredAt\` timestamp NULL,
    \`acknowledgedAt\` timestamp NULL,
    CONSTRAINT \`rc_messages_id\` PRIMARY KEY(\`id\`),
    INDEX \`rc_messages_computer_idx\` (\`computerId\`, \`status\`),
    INDEX \`rc_messages_user_idx\` (\`userId\`)
  )`,
];

let tablesReady: Promise<void> | null = null;

function ensureTables(): Promise<void> {
  tablesReady ??= (async () => {
    const db = getDb();
    for (const statement of CREATE_TABLES) await db.execute(sql.raw(statement));
  })().catch((error) => {
    tablesReady = null;
    throw error;
  });
  return tablesReady;
}

export function createMysqlRcStore(): RcStore {
  const db = async () => {
    await ensureTables();
    return getDb();
  };
  return {
    async createComputer(userId, name, tokenHash, tokenHint) {
      const d = await db();
      const [created] = await d.insert(rcComputers).values({ userId, name, tokenHash, tokenHint }).$returningId();
      const [row] = await d.select().from(rcComputers).where(eq(rcComputers.id, created.id)).limit(1);
      return row;
    },
    async listComputers(userId) {
      const d = await db();
      return d.select().from(rcComputers).where(eq(rcComputers.userId, userId)).orderBy(rcComputers.createdAt);
    },
    async getComputer(userId, id) {
      const d = await db();
      const rows = await d.select().from(rcComputers)
        .where(and(eq(rcComputers.id, id), eq(rcComputers.userId, userId))).limit(1);
      return rows.at(0);
    },
    async removeComputer(userId, id) {
      const d = await db();
      const owned = await d.select({ id: rcComputers.id }).from(rcComputers)
        .where(and(eq(rcComputers.id, id), eq(rcComputers.userId, userId))).limit(1);
      if (owned.length === 0) return false;
      await d.delete(rcMessages).where(eq(rcMessages.computerId, id));
      await d.delete(rcComputers).where(eq(rcComputers.id, id));
      return true;
    },
    async findComputerByTokenHash(tokenHash) {
      const d = await db();
      const rows = await d.select().from(rcComputers).where(eq(rcComputers.tokenHash, tokenHash)).limit(1);
      return rows.at(0);
    },
    async touchComputer(id, seen, at) {
      const d = await db();
      await d.update(rcComputers).set({
        lastSeenAt: at,
        lastIp: seen.ip?.slice(0, 64) ?? null,
        clientVersion: seen.version?.slice(0, 64) ?? null,
        hostName: seen.hostName?.slice(0, 255) ?? null,
      }).where(eq(rcComputers.id, id));
    },
    async createMessage(computerId, userId, expiresAt, build) {
      const d = await db();
      const [created] = await d.insert(rcMessages).values({ computerId, userId, expiresAt, payload: "{}" }).$returningId();
      await d.update(rcMessages).set({ payload: build(created.id) }).where(eq(rcMessages.id, created.id));
      const [row] = await d.select().from(rcMessages).where(eq(rcMessages.id, created.id)).limit(1);
      return row;
    },
    async takeDeliverable(computerId, now, redeliverBefore) {
      const d = await db();
      await d.update(rcMessages).set({ status: "expired" }).where(and(
        eq(rcMessages.computerId, computerId), eq(rcMessages.status, "queued"), lt(rcMessages.expiresAt, now)));
      const rows = await d.select().from(rcMessages).where(and(
        eq(rcMessages.computerId, computerId),
        or(
          eq(rcMessages.status, "queued"),
          and(eq(rcMessages.status, "delivered"), lt(rcMessages.deliveredAt, redeliverBefore)),
        ),
      )).orderBy(rcMessages.id).limit(50);
      if (rows.length === 0) return [];
      await d.update(rcMessages).set({ status: "delivered", deliveredAt: now })
        .where(inArray(rcMessages.id, rows.map((row) => row.id)));
      return rows.map((row) => ({ ...row, status: "delivered" as const, deliveredAt: now }));
    },
    async acknowledge(computerId, ids, at) {
      if (ids.length === 0) return 0;
      const d = await db();
      const owned = await d.select({ id: rcMessages.id }).from(rcMessages).where(and(
        eq(rcMessages.computerId, computerId), inArray(rcMessages.id, ids),
        or(eq(rcMessages.status, "delivered"), eq(rcMessages.status, "queued"))));
      if (owned.length === 0) return 0;
      await d.update(rcMessages).set({ status: "acknowledged", acknowledgedAt: at })
        .where(inArray(rcMessages.id, owned.map((row) => row.id)));
      return owned.length;
    },
    async listMessages(userId, limit) {
      const d = await db();
      return d.select().from(rcMessages).where(eq(rcMessages.userId, userId)).orderBy(desc(rcMessages.id)).limit(limit);
    },
    async countQueued(computerId, now) {
      const d = await db();
      const rows = await d.select({ id: rcMessages.id }).from(rcMessages).where(and(
        eq(rcMessages.computerId, computerId), eq(rcMessages.status, "queued"),
        sql`${rcMessages.expiresAt} >= ${now}`)).limit(1000);
      return rows.length;
    },
  };
}

let current: RcStore | null = null;

export function getRcStore(): RcStore {
  current ??= createMysqlRcStore();
  return current;
}

// Tests and the local check harness replace the database with a memory store.
export function setRcStore(store: RcStore | null): void {
  current = store;
}

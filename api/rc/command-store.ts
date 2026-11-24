// Tlamatini-RC — Angela López Mendoza · XAIHT
import { createHash, randomBytes } from "node:crypto";
import { and, asc, desc, eq, gt, inArray, lte, notInArray, or, sql } from "drizzle-orm";
import { rcCommands, rcComputers, type RcCommand } from "../../db/schema";
import { getDb } from "../queries/connection";
import { ensureTables } from "./store";
import {
  RC_COMMAND_LIMITS, RC_COMMAND_SCHEMA, RC_CONTROL_OPERATIONS, RC_DISCOVERY_OPERATIONS,
  commandLane, commandLaneCapacity, type RcCommandEnvelope, type RcCommandInput,
  type RcCommandResultInput,
} from "@contracts/rc-command";

export type { RcCommand };
export class RcCommandStoreError extends Error {
  readonly code: "not_found" | "conflict" | "queue_full";
  constructor(code: "not_found" | "conflict" | "queue_full", message: string) { super(message); this.code = code; }
}
export interface RcCommandStore {
  create(userId: number, name: string | null, input: RcCommandInput, now: Date): Promise<RcCommand>;
  get(userId: number, computerId: number, requestId: string): Promise<RcCommand | undefined>;
  recent(userId: number, computerId: number): Promise<RcCommand[]>;
  cancelQueued(userId: number, computerId: number, requestId: string, now: Date): Promise<RcCommand>;
  takeDeliverable(computerId: number, now: Date): Promise<RcCommand[]>;
  saveResult(computerId: number, input: RcCommandResultInput, now: Date): Promise<boolean>;
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).filter(key => object[key] !== undefined).sort().map(key => `${JSON.stringify(key)}:${canonical(object[key])}`).join(",")}}`;
}
export function commandHash(input: RcCommandInput): string {
  return createHash("sha256").update(canonical({
    operation: input.operation, bindingId: "bindingId" in input ? input.bindingId : null, payload: input.payload,
  })).digest("hex");
}
export function commandResponse(input: RcCommandResultInput): string {
  return canonical({ ok: input.ok, ...(input.result !== undefined ? { result: input.result } : {}), ...(input.error ? { error: input.error } : {}) });
}
export function duplicateResult(row: RcCommand, input: RcCommandResultInput, now: Date): boolean {
  // A lost HTTP acknowledgement must not stop an otherwise healthy watcher.
  // A retry acknowledges only an identical persisted frame; it never renews authority.
  return row.deliveryId === input.delivery_id && row.sequence === input.sequence && row.status === input.status &&
    row.response === commandResponse(input) && (row.status === "completed" || Boolean(row.leaseUntil && row.leaseUntil > now));
}
export function commandEnvelope(id: number, userId: number, name: string | null, computerName: string,
  input: RcCommandInput, now: Date, expires: Date): RcCommandEnvelope {
  return {
    schema: RC_COMMAND_SCHEMA, id, request_id: input.requestId,
    computer: { id: input.computerId, name: computerName },
    from: { site: "xaiht.org", user_id: userId, name },
    sent_at: now.toISOString(), expires_at: expires.toISOString(), operation: input.operation,
    ...("bindingId" in input ? { binding_id: input.bindingId } : {}), payload: input.payload,
  };
}

const CREATE_COMMANDS = `CREATE TABLE IF NOT EXISTS \`rc_commands\` (
  \`id\` serial AUTO_INCREMENT NOT NULL,
  \`computerId\` bigint unsigned NOT NULL,
  \`userId\` bigint unsigned NOT NULL,
  \`requestId\` varchar(32) NOT NULL,
  \`requestHash\` varchar(64) NOT NULL,
  \`operation\` varchar(40) NOT NULL,
  \`bindingId\` varchar(32),
  \`payload\` text NOT NULL,
  \`status\` enum('queued','delivered','running','completed','expired') NOT NULL DEFAULT 'queued',
  \`deliveryId\` varchar(32),
  \`sequence\` int unsigned NOT NULL DEFAULT 0,
  \`response\` mediumtext,
  \`createdAt\` timestamp NOT NULL DEFAULT (now()),
  \`updatedAt\` timestamp NOT NULL DEFAULT (now()),
  \`expiresAt\` timestamp NOT NULL,
  \`leaseUntil\` timestamp NULL,
  CONSTRAINT \`rc_commands_id\` PRIMARY KEY(\`id\`),
  CONSTRAINT \`rc_commands_computerId_rc_computers_id_fk\` FOREIGN KEY (\`computerId\`)
    REFERENCES \`rc_computers\`(\`id\`) ON DELETE CASCADE,
  UNIQUE INDEX \`rc_commands_request_unique\` (\`computerId\`,\`requestId\`),
  INDEX \`rc_commands_delivery_idx\` (\`computerId\`,\`status\`,\`leaseUntil\`),
  INDEX \`rc_commands_owner_idx\` (\`userId\`,\`computerId\`,\`createdAt\`)
)`;
let tablesReady: Promise<void> | null = null;
async function ready() {
  tablesReady ??= (async () => {
    await ensureTables();
    await getDb().execute(sql.raw(CREATE_COMMANDS));
  })().catch(error => { tablesReady = null; throw error; });
  await tablesReady;
  return getDb();
}

export function createMysqlRcCommandStore(): RcCommandStore {
  return {
    async create(userId, name, input, now) {
      const db = await ready();
      return db.transaction(async transaction => {
        // Serialize publication and the queue budget per computer. A request never
        // becomes deliverable with a placeholder payload, and removal cannot race it.
        const [computer] = await transaction.select().from(rcComputers).where(and(
          eq(rcComputers.id, input.computerId), eq(rcComputers.userId, userId),
        )).for("update");
        if (!computer) throw new RcCommandStoreError("not_found", "That computer is not connected to your account.");
        const hash = commandHash(input);
        const [existing] = await transaction.select().from(rcCommands).where(and(
          eq(rcCommands.computerId, input.computerId), eq(rcCommands.requestId, input.requestId),
        )).limit(1);
        if (existing) {
          if (existing.requestHash !== hash) throw new RcCommandStoreError("conflict", "This request ID belongs to a different operation. Do not retry it with changed content.");
          return existing;
        }
        await transaction.update(rcCommands).set({ status: "expired", updatedAt: now }).where(and(
          eq(rcCommands.computerId, input.computerId), eq(rcCommands.status, "queued"), lte(rcCommands.expiresAt, now),
        ));
        const lane = commandLane(input.operation);
        const budget = commandLaneCapacity(input.operation);
        const sameLane = lane === 0 ? inArray(rcCommands.operation, [...RC_CONTROL_OPERATIONS])
          : lane === 1 ? inArray(rcCommands.operation, [...RC_DISCOVERY_OPERATIONS])
          : notInArray(rcCommands.operation, [...RC_CONTROL_OPERATIONS, ...RC_DISCOVERY_OPERATIONS]);
        const queued = await transaction.select({ id: rcCommands.id }).from(rcCommands).where(and(
          eq(rcCommands.computerId, input.computerId), inArray(rcCommands.status, ["queued", "delivered", "running"]),
          sameLane,
        )).limit(budget);
        if (queued.length >= budget) throw new RcCommandStoreError("queue_full", "Too many operations are waiting for this computer. Reconnect it before sending more.");
        const expires = new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs);
        const [inserted] = await transaction.insert(rcCommands).values({
          userId, computerId: input.computerId, requestId: input.requestId, requestHash: hash,
          operation: input.operation, bindingId: "bindingId" in input ? input.bindingId : null,
          payload: "{}", createdAt: now, updatedAt: now, expiresAt: expires,
        }).$returningId();
        await transaction.update(rcCommands).set({
          payload: JSON.stringify(commandEnvelope(inserted.id, userId, name, computer.name, input, now, expires)),
        }).where(eq(rcCommands.id, inserted.id));
        const [row] = await transaction.select().from(rcCommands).where(eq(rcCommands.id, inserted.id));
        return row;
      });
    },
    async get(userId, computerId, requestId) {
      const db = await ready();
      const rows = await db.select({ command: rcCommands }).from(rcCommands).innerJoin(rcComputers, eq(rcComputers.id, rcCommands.computerId))
        .where(and(eq(rcCommands.userId, userId), eq(rcComputers.userId, userId), eq(rcCommands.computerId, computerId), eq(rcCommands.requestId, requestId))).limit(1);
      return rows[0]?.command;
    },
    async recent(userId, computerId) {
      const db = await ready();
      const owned = and(eq(rcCommands.userId, userId), eq(rcComputers.userId, userId),
        eq(rcCommands.computerId, computerId), eq(rcCommands.operation, "conversation.submit"));
      const [active, recent] = await Promise.all([
        db.select({ command: rcCommands }).from(rcCommands).innerJoin(rcComputers, eq(rcComputers.id, rcCommands.computerId))
          .where(and(owned, inArray(rcCommands.status, ["queued", "delivered", "running"])))
          .orderBy(desc(rcCommands.id)).limit(RC_COMMAND_LIMITS.queuedPerComputer),
        db.select({ command: rcCommands }).from(rcCommands).innerJoin(rcComputers, eq(rcComputers.id, rcCommands.computerId))
          .where(and(owned, inArray(rcCommands.status, ["completed", "expired"])))
          .orderBy(desc(rcCommands.id)).limit(25),
      ]);
      // Keep every bounded active prompt visible for cancellation even when newer
      // replies fill the history window. A transition between reads may duplicate
      // one row; prefer its terminal observation and return it only once.
      return [...new Map([...active, ...recent].map(row => [row.command.id, row.command])).values()]
        .sort((a, b) => b.id - a.id);
    },
    async cancelQueued(userId, computerId, requestId, now) {
      const db = await ready();
      return db.transaction(async transaction => {
        const [computer] = await transaction.select({ id: rcComputers.id }).from(rcComputers)
          .where(and(eq(rcComputers.id, computerId), eq(rcComputers.userId, userId))).for("update");
        if (!computer) throw new RcCommandStoreError("not_found", "That computer is not connected to your account.");
        const [row] = await transaction.select().from(rcCommands).where(and(
          eq(rcCommands.computerId, computerId), eq(rcCommands.userId, userId), eq(rcCommands.requestId, requestId),
        )).for("update");
        if (!row) throw new RcCommandStoreError("not_found", "The operation was not found.");
        const cancelled = JSON.stringify({ ok: false, error: { code: "cancelled_before_dispatch", message: "Cancelled before dispatch." } });
        if (row.status === "completed" && row.response === cancelled) return row;
        if (row.status !== "queued") throw new RcCommandStoreError("conflict", "The computer has already collected this operation. Use its running-operation Cancel control.");
        await transaction.update(rcCommands).set({ status: "completed", response: cancelled, updatedAt: now }).where(eq(rcCommands.id, row.id));
        return { ...row, status: "completed" as const, response: cancelled, updatedAt: now };
      });
    },
    async takeDeliverable(computerId, now) {
      const db = await ready();
      return db.transaction(async transaction => {
        const [computer] = await transaction.select({ id: rcComputers.id }).from(rcComputers).where(eq(rcComputers.id, computerId)).for("update");
        if (!computer) return [];
        await transaction.update(rcCommands).set({ status: "expired", updatedAt: now }).where(and(
          eq(rcCommands.computerId, computerId), eq(rcCommands.status, "queued"), lte(rcCommands.expiresAt, now),
        ));
        const rows = await transaction.select().from(rcCommands).where(and(eq(rcCommands.computerId, computerId), or(
          and(eq(rcCommands.status, "queued"), gt(rcCommands.expiresAt, now)),
          and(inArray(rcCommands.status, ["delivered", "running"]), lte(rcCommands.leaseUntil, now)),
        ))).orderBy(sql`CASE WHEN ${rcCommands.operation} IN ('conversation.cancel','conversation.permission') THEN 0 WHEN ${rcCommands.operation} IN ('accounts.list','application.status') THEN 1 ELSE 2 END`, asc(rcCommands.id)).limit(8).for("update");
        const leased: RcCommand[] = [];
        for (const row of rows) {
          const lease = { status: "delivered" as const, deliveryId: randomBytes(16).toString("hex"), sequence: 0,
            leaseUntil: new Date(now.getTime() + RC_COMMAND_LIMITS.leaseMs), updatedAt: now };
          await transaction.update(rcCommands).set(lease).where(eq(rcCommands.id, row.id));
          leased.push({ ...row, ...lease });
        }
        return leased;
      });
    },
    async saveResult(computerId, input, now) {
      const db = await ready();
      return db.transaction(async transaction => {
        const [computer] = await transaction.select({ id: rcComputers.id }).from(rcComputers).where(eq(rcComputers.id, computerId)).for("update");
        if (!computer) return false;
        const [row] = await transaction.select().from(rcCommands).where(and(
          eq(rcCommands.id, input.id), eq(rcCommands.computerId, computerId), eq(rcCommands.requestId, input.request_id),
        )).for("update");
        if (row && duplicateResult(row, input, now)) return true;
        if (!row || row.deliveryId !== input.delivery_id || row.sequence >= input.sequence ||
          !["delivered", "running"].includes(row.status) || !row.leaseUntil || row.leaseUntil <= now) return false;
        await transaction.update(rcCommands).set({
          status: input.status, sequence: input.sequence, updatedAt: now,
          response: commandResponse(input),
          leaseUntil: input.status === "running" ? new Date(now.getTime() + RC_COMMAND_LIMITS.leaseMs) : null,
        }).where(eq(rcCommands.id, row.id));
        return true;
      });
    },
  };
}

let current: RcCommandStore | null = null;
export function getRcCommandStore(): RcCommandStore { return current ??= createMysqlRcCommandStore(); }
export function setRcCommandStore(store: RcCommandStore | null): void { current = store; }

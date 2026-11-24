// Opt-in tests against a real, local MySQL server. Never uses DATABASE_URL.
import { randomBytes } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import mysql, { type Connection, type RowDataPacket } from "mysql2/promise";
import { RC_COMMAND_LIMITS, type RcCommandInput, type RcCommandResultInput } from "@contracts/rc-command";
import { env } from "../lib/env";
import { getDb } from "../queries/connection";
import { createMysqlRcStore, type RcComputer } from "./store";
import { createMysqlRcCommandStore, type RcCommandStore } from "./command-store";

const target = process.env.RC_MYSQL_TEST_URL;
const database = `xaiht_rc_qa_${randomBytes(8).toString("hex")}`;
const previousDatabaseUrl = env.databaseUrl;
const owner = 940001;
const bindingId = "b".repeat(32);
let administrator: Connection | undefined;
let databaseCreated = false;
let storeOpened = false;
let computer: RcComputer;
let commands: RcCommandStore;
const computers = createMysqlRcStore();
const requestId = () => randomBytes(16).toString("hex");
function request(id = requestId()): Extract<RcCommandInput, { operation: "conversation.submit" }> {
  return { computerId: computer.id, requestId: id, bindingId, operation: "conversation.submit",
    payload: { text: "Durable SQL protocol test — español 😀", options: { multi_turn_enabled: true, ask_execs_enabled: true } } };
}

describe.skipIf(!target)("real MySQL executable-command persistence", () => {
  beforeAll(async () => {
    const url = new URL(target!);
    if (url.protocol !== "mysql:" || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || url.search || url.hash)
      throw new Error("RC_MYSQL_TEST_URL must be a query-free mysql:// URL for a dedicated loopback test server.");
    // Generate the schema ourselves: never create, clear or migrate the supplied schema.
    url.pathname = "/";
    administrator = await mysql.createConnection(url.toString());
    await administrator.query(`CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`);
    databaseCreated = true;
    url.pathname = `/${database}`;
    env.databaseUrl = url.toString();
    commands = createMysqlRcCommandStore();
  }, 30_000);

  beforeEach(async () => {
    storeOpened = true;
    computer = await computers.createComputer(owner, "Isolated SQL verification", randomBytes(32).toString("hex"), "qa-only");
  });

  afterAll(async () => {
    try {
      if (storeOpened) await new Promise<void>((resolve, reject) => getDb().$client.end(error => error ? reject(error) : resolve()));
    } finally {
      env.databaseUrl = previousDatabaseUrl;
      if (administrator) {
        try { if (databaseCreated) await administrator.query(`DROP DATABASE \`${database}\``); }
        finally { await administrator.end(); }
      }
    }
  }, 30_000);

  it("publishes complete payloads atomically and deduplicates concurrent submissions", async () => {
    const input = request(); const now = new Date();
    const submitted = await Promise.all(Array.from({ length: 12 }, () => commands.create(owner, "QA", input, now)));
    expect(new Set(submitted.map(row => row.id)).size).toBe(1);
    expect(JSON.parse(submitted[0].payload)).toMatchObject({ id: submitted[0].id, request_id: input.requestId, payload: input.payload });
    await expect(commands.create(owner, "QA", { ...input, operation: "conversation.submit", payload: { text: "changed" } }, now)).rejects.toThrow("different operation");
    const reopened = createMysqlRcCommandStore();
    expect((await reopened.get(owner, computer.id, input.requestId))?.id).toBe(submitted[0].id);
    const polls = await Promise.all(Array.from({ length: 4 }, () => reopened.takeDeliverable(computer.id, now)));
    expect(polls.flat()).toHaveLength(1);
    expect(JSON.parse(polls.flat()[0].payload).schema).toBe("xaiht.tlamatini-rc.command/1");
  });

  it("preserves ownership on reads, mutations and results", async () => {
    const now = new Date(); const input = request();
    const sent = await commands.create(owner, "QA", input, now);
    expect(await commands.get(owner + 1, computer.id, input.requestId)).toBeUndefined();
    expect(await commands.recent(owner + 1, computer.id)).toEqual([]);
    await expect(commands.create(owner + 1, "wrong owner", request(), now)).rejects.toThrow("your account");
    await expect(commands.cancelQueued(owner + 1, computer.id, input.requestId, now)).rejects.toThrow("your account");
    const other = await computers.createComputer(owner + 1, "Other test owner", randomBytes(32).toString("hex"), "qa-only");
    const [lease] = await commands.takeDeliverable(computer.id, now);
    expect(await commands.saveResult(other.id, { id: sent.id, request_id: input.requestId, delivery_id: lease.deliveryId!, sequence: 1, status: "completed", ok: true }, now)).toBe(false);
  });

  it("survives lost result acknowledgements and rotates stale delivery authority", async () => {
    const now = new Date(); const sent = await commands.create(owner, "QA", request(), now);
    const [lease] = await commands.takeDeliverable(computer.id, now);
    const frame: RcCommandResultInput = { id: sent.id, request_id: sent.requestId, delivery_id: lease.deliveryId!, sequence: 1,
      status: "running", ok: true, result: { operation: { id: "a".repeat(32), state: "running" } } };
    expect(await commands.saveResult(computer.id, frame, now)).toBe(true);
    expect(await commands.saveResult(computer.id, frame, now)).toBe(true);
    expect(await commands.saveResult(computer.id, { ...frame, result: "changed" }, now)).toBe(false);
    const later = new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs + 2_000);
    const [retry] = await commands.takeDeliverable(computer.id, later);
    expect(retry.requestId).toBe(sent.requestId); expect(retry.payload).toBe(sent.payload);
    expect(retry.deliveryId).not.toBe(lease.deliveryId);
    expect(await commands.saveResult(computer.id, { ...frame, sequence: 10, status: "completed" }, later)).toBe(false);
    const final: RcCommandResultInput = { ...frame, delivery_id: retry.deliveryId!, status: "completed", result: { operation: { state: "completed", result: { text: "Persisted answer 😀" } } } };
    expect(await commands.saveResult(computer.id, final, later)).toBe(true);
    expect(await commands.saveResult(computer.id, final, later)).toBe(true);
    expect(await commands.saveResult(computer.id, { ...final, sequence: 2 }, later)).toBe(false);
    expect(JSON.parse((await createMysqlRcCommandStore().get(owner, computer.id, sent.requestId))!.response!)).toMatchObject({ result: final.result });
  });

  it("enforces independent normal, discovery and control budgets transactionally", async () => {
    const now = new Date();
    const batch = await Promise.allSettled(Array.from({ length: RC_COMMAND_LIMITS.queuedPerComputer + 6 }, () => commands.create(owner, "QA", request(), now)));
    expect(batch.filter(item => item.status === "fulfilled")).toHaveLength(RC_COMMAND_LIMITS.queuedPerComputer);
    expect(batch.filter(item => item.status === "rejected")).toHaveLength(6);
    const discovery = await Promise.allSettled(Array.from({ length: RC_COMMAND_LIMITS.discoveryReserve + 2 }, () =>
      commands.create(owner, "QA", { computerId: computer.id, requestId: requestId(), operation: "accounts.list", payload: {} }, now)));
    expect(discovery.filter(item => item.status === "fulfilled")).toHaveLength(RC_COMMAND_LIMITS.discoveryReserve);
    expect(discovery.filter(item => item.status === "rejected")).toHaveLength(2);
    const controls = await Promise.allSettled(Array.from({ length: RC_COMMAND_LIMITS.urgentControlReserve + 2 }, () =>
      commands.create(owner, "QA", { computerId: computer.id, requestId: requestId(), bindingId, operation: "conversation.cancel", payload: { operation_id: "a".repeat(32) } }, now)));
    expect(controls.filter(item => item.status === "fulfilled")).toHaveLength(RC_COMMAND_LIMITS.urgentControlReserve);
    expect(controls.filter(item => item.status === "rejected")).toHaveLength(2);
    expect((await commands.takeDeliverable(computer.id, now)).map(row => row.operation)).toEqual(Array(8).fill("conversation.cancel"));
    const next = await commands.takeDeliverable(computer.id, now);
    expect(next.slice(0, 4).map(row => row.operation)).toEqual(Array(4).fill("accounts.list"));
    expect(next.slice(4).map(row => row.operation)).toEqual(Array(4).fill("conversation.submit"));
  }, 30_000);

  it("serializes queued cancellation against delivery without executing cancelled work", async () => {
    const now = new Date(); const sent = await commands.create(owner, "QA", request(), now);
    const [cancelled, delivered] = await Promise.allSettled([
      commands.cancelQueued(owner, computer.id, sent.requestId, now), commands.takeDeliverable(computer.id, now),
    ]);
    expect(delivered.status).toBe("fulfilled");
    if (delivered.status !== "fulfilled") throw new Error("Delivery failed");
    if (cancelled.status === "fulfilled") {
      expect(delivered.value).toEqual([]);
      expect(cancelled.value.status).toBe("completed");
    } else {
      expect(delivered.value.map(row => row.id)).toEqual([sent.id]);
      expect(String(cancelled.reason)).toContain("already collected");
    }
  });

  it("retains active cancellation identities alongside the latest terminal history", async () => {
    const now = new Date(); const old = await commands.create(owner, "QA", request(), now);
    const [lease] = await commands.takeDeliverable(computer.id, now);
    await commands.saveResult(computer.id, { id: old.id, request_id: old.requestId, delivery_id: lease.deliveryId!,
      sequence: 1, status: "running", ok: true, result: { operation: { id: "a".repeat(32), state: "running" } } }, now);
    for (let i = 0; i < 27; i++) {
      const next = await commands.create(owner, "QA", request(), now);
      const [nextLease] = await commands.takeDeliverable(computer.id, now);
      await commands.saveResult(computer.id, { id: next.id, request_id: next.requestId, delivery_id: nextLease.deliveryId!,
        sequence: 1, status: "completed", ok: true }, now);
    }
    const visible = await commands.recent(owner, computer.id);
    expect(visible).toHaveLength(26);
    expect(visible.find(row => row.id === old.id)?.status).toBe("running");
    expect(visible.filter(row => row.status === "completed")).toHaveLength(25);
  }, 30_000);

  it("expires only new dispatch and cascades command removal on computer revocation", async () => {
    const now = new Date(); const sent = await commands.create(owner, "QA", request(), now);
    expect(await commands.takeDeliverable(computer.id, new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs + 2_000))).toEqual([]);
    expect((await commands.get(owner, computer.id, sent.requestId))?.status).toBe("expired");
    await commands.create(owner, "QA", request(), now);
    const [lease] = await commands.takeDeliverable(computer.id, now);
    expect(await computers.removeComputer(owner, computer.id)).toBe(true);
    expect(await commands.get(owner, computer.id, sent.requestId)).toBeUndefined();
    expect(await commands.saveResult(computer.id, { id: lease.id, request_id: lease.requestId, delivery_id: lease.deliveryId!, sequence: 1, status: "completed", ok: true }, now)).toBe(false);
    const [rows] = await administrator!.query<RowDataPacket[]>(`SELECT COUNT(*) AS remaining FROM \`${database}\`.rc_commands WHERE computerId = ?`, [computer.id]);
    expect(Number(rows[0].remaining)).toBe(0);
  });
});

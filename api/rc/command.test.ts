// Executable-channel contracts. Fixtures exercise protocol/storage, not a model answer.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import { rcCommandInput, RC_COMMAND_LIMITS, type RcCommandInput, type RcCommandResultInput } from "@contracts/rc-command";
import type { User } from "../../db/schema";
import { env } from "../lib/env";
import { rcCommandRouter } from "../rc-command-router";
import { rcRouter } from "../rc-router";
import { registerRcRoutes } from "./http";
import { createMemoryRcStore } from "./memory-store";
import { createMemoryRcCommandStore } from "./memory-command-store";
import { setRcStore } from "./store";
import { setRcCommandStore, type RcCommandStore } from "./command-store";

const bindingId = "b".repeat(32);
const origin = env.publicBaseUrl ? new URL(env.publicBaseUrl).origin : "http://localhost";
function user(id: number): User {
  const now = new Date();
  return { id, unionId: `qa-${id}`, name: `QA ${id}`, email: null, avatar: null, role: "user", createdAt: now, updatedAt: now, lastSignInAt: now };
}
function context(id = 1, requestOrigin: string | null = origin) {
  return { user: user(id), resHeaders: new Headers(), req: new Request(`${origin}/api/trpc`, {
    method: "POST", headers: requestOrigin ? { origin: requestOrigin } : {},
  }) };
}
const caller = (id = 1) => rcCommandRouter.createCaller(context(id));
const oldCaller = (id = 1) => rcRouter.createCaller(context(id));
function app() { const app = new Hono(); registerRcRoutes(app, { checkEveryMs: 10 }); return app; }
function input(computerId: number, requestId = "1".repeat(32)): Extract<RcCommandInput, { operation: "conversation.submit" }> {
  return { computerId, requestId, bindingId, operation: "conversation.submit", payload: {
    text: "Explain this request — español 😀", options: { multi_turn_enabled: true, ask_execs_enabled: true },
  } };
}
let commands: RcCommandStore;
beforeEach(() => { setRcStore(createMemoryRcStore()); commands = createMemoryRcCommandStore(); setRcCommandStore(commands); });
afterEach(() => { setRcCommandStore(null); setRcStore(null); });
async function computer(id = 1) { return oldCaller(id).addComputer({ name: `QA computer ${id}` }); }
function headers(key: string, capable = true) {
  return { authorization: `Bearer ${key}`, ...(capable ? { "x-tlachihuani-command-protocol": "1" } : {}) };
}
async function poll(hono: Hono, key: string, capable = true) {
  const response = await hono.request("/api/rc/poll?wait=0", { headers: headers(key, capable) });
  return { status: response.status, body: await response.json() as {
    computer: { id: number; user_id: number }; messages: unknown[];
    commands: { id: number; delivery_id: string; payload: { request_id: string; operation: string; binding_id: string; payload: unknown } }[];
  } };
}
async function result(hono: Hono, key: string, value: RcCommandResultInput) {
  return hono.request("/api/rc/result", { method: "POST", headers: { ...headers(key), "content-type": "application/json" }, body: JSON.stringify(value) });
}

describe("typed prompt channel", () => {
  it.each([true, false])("preserves explicit Ask Execs=%s through storage, native polling and idempotent retry", async askExecs => {
    const pc = await computer(); const hono = app();
    const request = input(pc.computer.id);
    request.payload.options = { multi_turn_enabled: true, ask_execs_enabled: askExecs };
    const sent = await caller().send(request);
    expect(sent.payload).toEqual(request.payload);
    expect((await caller().recent({ computerId: pc.computer.id }))[0].payload).toEqual(request.payload);
    const delivered = (await poll(hono, pc.key)).body.commands[0];
    expect(delivered.payload.payload).toEqual(request.payload);
    expect((await caller().send(request)).id).toBe(sent.id);
    await expect(caller().send({ ...request, payload: { ...request.payload,
      options: { multi_turn_enabled: true, ask_execs_enabled: !askExecs },
    } })).rejects.toThrow("different operation");
    expect((await caller().get({ computerId: pc.computer.id, requestId: sent.requestId }))?.payload).toEqual(request.payload);
  });

  it("keeps a maximal mixed diagnostic/command poll below the native byte limit without truncation", async () => {
    const richContext = context(); richContext.user.name = "\u0001".repeat(255);
    const diagnostic = rcRouter.createCaller(richContext);
    const executable = rcCommandRouter.createCaller(richContext);
    const pc = await diagnostic.addComputer({ name: "\u0001".repeat(80) });
    const prompt = "\u0001".repeat(3999); // 23,996 JSON UTF-8 bytes, just under the native limit.
    for (let i = 1; i <= 9; i++) {
      await diagnostic.send({ computerId: pc.computer.id, target: "tlamatini", type: "text", level: "info",
        subject: "\u0001".repeat(120), message: "\u0001".repeat(4000), ttlMinutes: 5 });
      await executable.send({ ...input(pc.computer.id, i.toString(16).padStart(32, "0")), payload: { text: prompt } });
    }
    const hono = app();
    const response = await hono.request("/api/rc/poll?wait=0", { headers: headers(pc.key) });
    const encoded = await response.text();
    expect(new TextEncoder().encode(encoded).length).toBeLessThan(512 * 1024);
    const decoded = JSON.parse(encoded);
    expect(decoded.messages).toHaveLength(8); expect(decoded.commands).toHaveLength(8);
    expect(decoded.messages[0].payload.message).toBe("\u0001".repeat(4000));
    expect(decoded.commands[0].payload.payload.text).toBe(prompt);
    const remaining = await poll(hono, pc.key);
    expect(remaining.body.messages).toHaveLength(1); expect(remaining.body.commands).toHaveLength(1);
  });

  it("preserves inert legacy command messages and never leases executable work to an old XT", async () => {
    const pc = await computer(); const hono = app();
    await caller().send(input(pc.computer.id));
    await oldCaller().send({ computerId: pc.computer.id, target: "tlamatini", type: "command", level: "info", subject: "", message: "legacy inert", ttlMinutes: 5 });
    const old = await poll(hono, pc.key, false);
    expect(old.body.messages).toHaveLength(1);
    expect(old.body.commands).toEqual([]);
    expect((await caller().recent({ computerId: pc.computer.id }))[0].status).toBe("queued");
    const live = await poll(hono, pc.key);
    expect(live.body.computer).toMatchObject({ id: pc.computer.id, user_id: 1 });
    expect(live.body.commands[0].payload).toMatchObject({ operation: "conversation.submit", binding_id: bindingId, payload: input(pc.computer.id).payload });
  });

  it("returns progress and the final answer separately from transport acceptance", async () => {
    const pc = await computer(); const hono = app();
    const sent = await caller().send(input(pc.computer.id));
    expect(sent.response).toBeNull(); expect(sent.status).toBe("queued");
    const delivered = (await poll(hono, pc.key)).body.commands[0];
    const base = { id: sent.id, request_id: sent.requestId, delivery_id: delivered.delivery_id };
    expect((await result(hono, pc.key, { ...base, sequence: 1, status: "running", ok: true, result: { operation: { id: "a".repeat(32), state: "awaiting_permission" } } })).status).toBe(200);
    expect((await caller().get({ computerId: pc.computer.id, requestId: sent.requestId }))?.status).toBe("running");
    expect((await result(hono, pc.key, { ...base, sequence: 2, status: "completed", ok: true, result: { operation: { state: "completed", result: { text: "Actual adapter answer" } } } })).status).toBe(200);
    const row = await caller().get({ computerId: pc.computer.id, requestId: sent.requestId });
    expect(row).toMatchObject({ status: "completed", payload: input(pc.computer.id).payload,
      response: { ok: true, result: { operation: { result: { text: "Actual adapter answer" } } } } });
  });

  it("requires authenticated ownership for send, recent, get, cancel and result", async () => {
    const first = await computer(); const second = await computer(2); const hono = app();
    const sent = await caller().send(input(first.computer.id));
    await expect(caller(2).send(input(first.computer.id))).rejects.toThrow();
    expect(await caller(2).get({ computerId: first.computer.id, requestId: sent.requestId })).toBeNull();
    expect(await caller(2).recent({ computerId: first.computer.id })).toEqual([]);
    await expect(caller(2).cancelQueued({ computerId: first.computer.id, requestId: sent.requestId })).rejects.toThrow();
    const lease = (await poll(hono, first.key)).body.commands[0];
    expect((await result(hono, second.key, { id: sent.id, request_id: sent.requestId, delivery_id: lease.delivery_id, sequence: 1, status: "completed", ok: true, result: {} })).status).toBe(409);
    await expect(rcCommandRouter.createCaller({ req: context().req, resHeaders: new Headers() }).send(input(first.computer.id))).rejects.toThrow();
  });

  it("requires same-origin POST for execution and queued cancellation", async () => {
    const pc = await computer();
    for (const suppliedOrigin of [null, "https://attacker.invalid", "null"]) {
      const bad = rcCommandRouter.createCaller(context(1, suppliedOrigin));
      await expect(bad.send(input(pc.computer.id))).rejects.toThrow("signed-in page");
      await expect(bad.cancelQueued({ computerId: pc.computer.id, requestId: "1".repeat(32) })).rejects.toThrow("signed-in page");
    }
  });

  it("deduplicates concurrent retries by stable identity and refuses changed content", async () => {
    const pc = await computer(); const same = input(pc.computer.id);
    const rows = await Promise.all(Array.from({ length: 8 }, () => caller().send(same)));
    expect(new Set(rows.map(row => row.id)).size).toBe(1);
    await expect(caller().send({ ...same, operation: "conversation.submit", payload: { text: "changed" } })).rejects.toThrow("different operation");
    expect(await caller().recent({ computerId: pc.computer.id })).toHaveLength(1);
  });

  it("expires undispatched work but keeps a delivered request identity on lease recovery", async () => {
    const pc = await computer(); const now = new Date();
    await commands.create(1, "QA", input(pc.computer.id), now);
    expect(await commands.takeDeliverable(pc.computer.id, new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs + 1))).toEqual([]);
    expect((await commands.recent(1, pc.computer.id))[0].status).toBe("expired");
    const second = await commands.create(1, "QA", input(pc.computer.id, "2".repeat(32)), now);
    const [lease] = await commands.takeDeliverable(pc.computer.id, now);
    const later = new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs + 1);
    const [retry] = await commands.takeDeliverable(pc.computer.id, later);
    expect(retry.id).toBe(second.id); expect(retry.requestId).toBe(second.requestId);
    expect(retry.deliveryId).not.toBe(lease.deliveryId);
    expect(retry.payload).toBe(lease.payload);
    expect(await commands.saveResult(pc.computer.id, { id: second.id, request_id: second.requestId, delivery_id: lease.deliveryId!, sequence: 10, status: "completed", ok: true }, later)).toBe(false);
  });

  it("acknowledges identical retries and rejects reordered, changed, expired-lease and post-terminal results", async () => {
    const pc = await computer(); const now = new Date();
    const sent = await commands.create(1, "QA", input(pc.computer.id), now);
    const [lease] = await commands.takeDeliverable(pc.computer.id, now);
    const frame: RcCommandResultInput = { id: sent.id, request_id: sent.requestId, delivery_id: lease.deliveryId!, sequence: 2, status: "running", ok: true };
    expect(await commands.saveResult(pc.computer.id, frame, now)).toBe(true);
    expect(await commands.saveResult(pc.computer.id, frame, now)).toBe(true);
    expect(await commands.saveResult(pc.computer.id, { ...frame, result: "changed" }, now)).toBe(false);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 1 }, now)).toBe(false);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 3 }, new Date(now.getTime() + RC_COMMAND_LIMITS.leaseMs + 1))).toBe(false);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 3, status: "completed" }, now)).toBe(true);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 3, status: "completed" }, now)).toBe(true);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 3, status: "completed", result: "changed" }, now)).toBe(false);
    expect(await commands.saveResult(pc.computer.id, { ...frame, sequence: 4 }, now)).toBe(false);
  });

  it("cancels only queued work, idempotently, and refuses a dispatch race", async () => {
    const pc = await computer(); const sent = await caller().send(input(pc.computer.id));
    const key = { computerId: pc.computer.id, requestId: sent.requestId };
    const cancelled = await caller().cancelQueued(key);
    expect(cancelled).toMatchObject({ status: "completed", response: { ok: false, error: { code: "cancelled_before_dispatch" } } });
    expect((await caller().cancelQueued(key)).id).toBe(sent.id);
    expect(await commands.takeDeliverable(pc.computer.id, new Date())).toEqual([]);
    const next = await caller().send(input(pc.computer.id, "2".repeat(32)));
    await commands.takeDeliverable(pc.computer.id, new Date());
    await expect(caller().cancelQueued({ computerId: pc.computer.id, requestId: next.requestId })).rejects.toThrow("already collected");
  });

  it("revokes an outstanding long poll and rejects late results after computer removal", async () => {
    const pc = await computer(); const hono = app();
    const waiting = hono.request("/api/rc/poll?wait=5", { headers: headers(pc.key) });
    await new Promise(resolve => setTimeout(resolve, 30));
    await oldCaller().removeComputer({ id: pc.computer.id });
    expect((await waiting).status).toBe(401);
    expect((await result(hono, pc.key, { id: 1, request_id: "1".repeat(32), delivery_id: "a".repeat(32), sequence: 1, status: "completed", ok: true })).status).toBe(401);
    expect(await caller().recent({ computerId: pc.computer.id })).toEqual([]);
  });

  it("bounds executable queues and retains reads for the current computer only", async () => {
    const pc = await computer();
    for (let i = 1; i <= RC_COMMAND_LIMITS.queuedPerComputer; i++) await caller().send(input(pc.computer.id, i.toString(16).padStart(32, "0")));
    await expect(caller().send(input(pc.computer.id, "f".repeat(32)))).rejects.toThrow("Too many");
    expect(await caller().recent({ computerId: pc.computer.id })).toHaveLength(RC_COMMAND_LIMITS.queuedPerComputer);
    const cancel: RcCommandInput = { computerId: pc.computer.id, requestId: "c".repeat(32), bindingId,
      operation: "conversation.cancel", payload: { operation_id: "a".repeat(32) } };
    expect((await caller().send(cancel)).status).toBe("queued");
    expect((await commands.takeDeliverable(pc.computer.id, new Date()))[0].operation).toBe("conversation.cancel");
  });

  it("keeps an older running prompt and its cancellation identity visible after the terminal history fills", async () => {
    const pc = await computer(); const now = new Date();
    const old = await commands.create(1, "QA", input(pc.computer.id), now);
    const [lease] = await commands.takeDeliverable(pc.computer.id, now);
    await commands.saveResult(pc.computer.id, { id: old.id, request_id: old.requestId, delivery_id: lease.deliveryId!,
      sequence: 1, status: "running", ok: true, result: { operation: { id: "a".repeat(32), state: "running" } } }, now);
    for (let i = 2; i <= 28; i++) {
      const next = await commands.create(1, "QA", input(pc.computer.id, i.toString(16).padStart(32, "0")), now);
      const [nextLease] = await commands.takeDeliverable(pc.computer.id, now);
      await commands.saveResult(pc.computer.id, { id: next.id, request_id: next.requestId, delivery_id: nextLease.deliveryId!,
        sequence: 1, status: "completed", ok: true, result: { operation: { state: "succeeded" } } }, now);
    }
    const visible = await caller().recent({ computerId: pc.computer.id });
    expect(visible).toHaveLength(26);
    expect(visible.find(row => row.id === old.id)).toMatchObject({ status: "running", bindingId,
      response: { result: { operation: { id: "a".repeat(32), state: "running" } } } });
    expect(visible.filter(row => row.status === "completed")).toHaveLength(25);
  });

  it("allows account discovery and cancellation after reload with every normal slot occupied", async () => {
    const pc = await computer(); const hono = app();
    for (let i = 1; i <= RC_COMMAND_LIMITS.queuedPerComputer; i++)
      await caller().send(input(pc.computer.id, i.toString(16).padStart(32, "0")));
    const discovery = (i: number): RcCommandInput => i % 2 === 0
      ? { computerId: pc.computer.id, requestId: `d${i.toString(16).padStart(31, "0")}`, operation: "accounts.list", payload: {} }
      : { computerId: pc.computer.id, requestId: `d${i.toString(16).padStart(31, "0")}`, bindingId, operation: "application.status", payload: {} };
    for (let i = 0; i < RC_COMMAND_LIMITS.discoveryReserve; i++) await caller().send(discovery(i));
    await expect(caller().send(discovery(4))).rejects.toThrow("Too many");
    await expect(caller().send({ computerId: pc.computer.id, requestId: "e".repeat(32), bindingId,
      operation: "operation.get", payload: { operation_id: "a".repeat(32) } })).rejects.toThrow("Too many");
    const cancel = (i: number): RcCommandInput => ({ computerId: pc.computer.id, requestId: `c${i.toString(16).padStart(31, "0")}`,
      bindingId, operation: "conversation.cancel", payload: { operation_id: "a".repeat(32) } });
    for (let i = 0; i < RC_COMMAND_LIMITS.urgentControlReserve; i++) await caller().send(cancel(i));
    await expect(caller().send(cancel(8))).rejects.toThrow("Too many");
    expect((await poll(hono, pc.key)).body.commands.map(command => command.payload.operation)).toEqual(Array(8).fill("conversation.cancel"));
    const next = (await poll(hono, pc.key)).body.commands;
    expect(next.slice(0, 4).map(command => command.payload.operation)).toEqual(["accounts.list", "application.status", "accounts.list", "application.status"]);
    expect(next.slice(4).map(command => command.payload.operation)).toEqual(Array(4).fill("conversation.submit"));
    const accounts = next[0];
    expect((await result(hono, pc.key, { id: accounts.id, request_id: accounts.payload.request_id, delivery_id: accounts.delivery_id,
      sequence: 1, status: "completed", ok: true, result: { accounts: [{ id: bindingId, display_name: "QA account", edition: "en", application_state: "ready" }] } })).status).toBe(200);
    expect((await caller().get({ computerId: pc.computer.id, requestId: accounts.payload.request_id }))?.response).toMatchObject({
      result: { accounts: [{ id: bindingId }] },
    });
    expect((await caller().cancelQueued({ computerId: pc.computer.id, requestId: (100).toString(16).padStart(32, "0") })).status).toBe("completed");
    // Independent lane capacity: existing controls/discovery never consume the
    // normal slot just freed by cancellation.
    expect((await caller().send(input(pc.computer.id, "f".repeat(32)))).status).toBe("queued");
  });

  it("limits result bytes and rejects malformed result identities", async () => {
    const pc = await computer(); const hono = app();
    const sent = await caller().send(input(pc.computer.id));
    const lease = (await poll(hono, pc.key)).body.commands[0];
    const base: RcCommandResultInput = { id: sent.id, request_id: sent.requestId, delivery_id: lease.delivery_id, sequence: 1, status: "completed", ok: true };
    expect((await result(hono, pc.key, { ...base, result: "x".repeat(RC_COMMAND_LIMITS.resultBytes) })).status).toBe(413);
    expect((await result(hono, pc.key, { ...base, result: "x".repeat(RC_COMMAND_LIMITS.responseBodyBytes) })).status).toBe(413);
    expect((await result(hono, pc.key, { ...base, sequence: 0 })).status).toBe(400);
    expect((await result(hono, pc.key, { ...base, ok: false })).status).toBe(400);
    expect((await caller().get({ computerId: pc.computer.id, requestId: sent.requestId }))?.response).toBeNull();
  });

  it("keeps control RPCs out of conversation history and preserves exact consent identity", async () => {
    const pc = await computer();
    const permission = await caller().send({ computerId: pc.computer.id, requestId: "a".repeat(32), bindingId,
      operation: "conversation.permission", payload: { operation_id: "c".repeat(32), request_id: "specific-consent", decision: "deny" } });
    expect(permission.payload).toEqual({ operation_id: "c".repeat(32), request_id: "specific-consent", decision: "deny" });
    expect(await caller().recent({ computerId: pc.computer.id })).toEqual([]);
  });
});

describe("closed command validation", () => {
  it("refuses shell operations, arbitrary paths, account display names and unknown options", () => {
    const good = input(1);
    for (const value of [
      { ...good, operation: "shell.execute" }, { ...good, executable: "cmd.exe" }, { ...good, bindingId: "angela" },
      { ...good, payload: { text: "Hi", options: { bypass_approval: true } } },
      { ...good, payload: { text: "Hi", options: { multi_turn_enabled: false, ask_execs_enabled: true } } },
      { ...good, payload: { text: "Hi", command: "cmd.exe" } },
    ]) expect(rcCommandInput.safeParse(value).success).toBe(false);
  });
  it("enforces native character and UTF-8 limits and bounded content offsets", () => {
    expect(rcCommandInput.safeParse({ ...input(1), payload: { text: "x".repeat(16001) } }).success).toBe(false);
    expect(rcCommandInput.safeParse({ ...input(1), payload: { text: "界".repeat(9000) } }).success).toBe(false);
    expect(rcCommandInput.safeParse({ computerId: 1, requestId: "1".repeat(32), bindingId, operation: "response.content", payload: { ticket: "opaque", offset: 0 } }).success).toBe(true);
    expect(rcCommandInput.safeParse({ computerId: 1, requestId: "1".repeat(32), bindingId, operation: "response.content", payload: { ticket: "opaque", offset: 8 * 1024 * 1024 + 1 } }).success).toBe(false);
  });
});

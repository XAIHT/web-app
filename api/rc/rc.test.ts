// Tlamatini-RC — Angela López Mendoza · XAIHT
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import type { User } from "../../db/schema";
import { RC_SCHEMA } from "@contracts/rc";
import { rcRouter } from "../rc-router";
import { registerRcRoutes } from "./http";
import { hashComputerKey, keyFromAuthorization, newComputerKey } from "./keys";
import { createMemoryRcStore } from "./memory-store";
import { setRcStore, type RcStore } from "./store";

function user(id: number, name: string): User {
  const now = new Date();
  return { id, unionId: `google-${id}`, name, email: null, avatar: null, role: "user", createdAt: now, updatedAt: now, lastSignInAt: now };
}

function caller(who: User) {
  return rcRouter.createCaller({ req: new Request("http://localhost/api/trpc"), resHeaders: new Headers(), user: who });
}

function app() {
  const hono = new Hono();
  registerRcRoutes(hono, { checkEveryMs: 50 });
  return hono;
}

const angela = user(1, "Angela López Mendoza");
const other = user(2, "Someone Else");
let store: RcStore;

beforeEach(() => {
  store = createMemoryRcStore();
  setRcStore(store);
});
afterEach(() => setRcStore(null));

async function poll(hono: Hono, key: string, wait = 0) {
  const response = await hono.request(`/api/rc/poll?wait=${wait}`, {
    headers: { authorization: `Bearer ${key}`, "x-tlachihuani-computer": "ANGELA-LAPTOP", "x-tlachihuani-version": "0.36.0" },
  });
  return { status: response.status, body: (await response.json()) as { messages: { id: number; payload: Record<string, unknown> }[]; computer: { name: string } } };
}

describe("computer keys", () => {
  it("are random, prefixed and stored only as a hash", () => {
    const one = newComputerKey();
    const two = newComputerKey();
    expect(one.key).toMatch(/^xrc_[A-Za-z0-9_-]{43}$/);
    expect(one.key).not.toBe(two.key);
    expect(one.hash).toBe(hashComputerKey(one.key));
    expect(one.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(one.hint).toBe(one.key.slice(-4));
    expect(keyFromAuthorization(`Bearer ${one.key}`)).toBe(one.key);
    expect(keyFromAuthorization("Bearer nope")).toBeNull();
    expect(keyFromAuthorization(null)).toBeNull();
  });
});

describe("Tlamatini-RC delivery", () => {
  it("refuses a computer without a valid key", async () => {
    const response = await app().request("/api/rc/poll?wait=0");
    expect(response.status).toBe(401);
    const wrong = await app().request("/api/rc/poll?wait=0", { headers: { authorization: `Bearer ${newComputerKey().key}` } });
    expect(wrong.status).toBe(401);
  });

  it("shows the computer online while it asks, and offline when it never asked", async () => {
    const hono = app();
    const added = await caller(angela).addComputer({ name: "Laptop" });
    expect((await caller(angela).computers())[0]).toMatchObject({ name: "Laptop", online: false, everConnected: false });
    const first = await poll(hono, added.key);
    expect(first.status).toBe(200);
    expect(first.body.messages).toEqual([]);
    expect(first.body.computer.name).toBe("Laptop");
    const [listed] = await caller(angela).computers();
    expect(listed).toMatchObject({ online: true, everConnected: true, hostName: "ANGELA-LAPTOP", clientVersion: "0.36.0" });
  });

  it("delivers the exact JSON, then records that Tlachihuani wrote it", async () => {
    const hono = app();
    const added = await caller(angela).addComputer({ name: "Laptop" });
    const sent = await caller(angela).send({
      computerId: added.computer.id, target: "tlachihuani", type: "text", level: "info",
      subject: "Hello", message: "Hola desde xaiht.org — ñ, ü, 😀", ttlMinutes: 60,
    });
    expect(sent.status).toBe("queued");
    const got = await poll(hono, added.key);
    expect(got.body.messages).toHaveLength(1);
    const payload = got.body.messages[0].payload;
    expect(payload).toMatchObject({
      schema: RC_SCHEMA, id: sent.id, target: "tlachihuani", type: "text", level: "info", subject: "Hello",
      message: "Hola desde xaiht.org — ñ, ü, 😀",
      from: { site: "xaiht.org", user_id: 1, name: "Angela López Mendoza" },
      computer: { id: added.computer.id, name: "Laptop" },
    });
    expect((await caller(angela).messages())[0].status).toBe("delivered");
    // Delivered messages are not handed out again before the redelivery delay.
    expect((await poll(hono, added.key)).body.messages).toHaveLength(0);
    const ack = await hono.request("/api/rc/ack", {
      method: "POST", headers: { authorization: `Bearer ${added.key}`, "content-type": "application/json" },
      body: JSON.stringify({ ids: [sent.id] }),
    });
    expect(await ack.json()).toEqual({ acknowledged: 1 });
    const [record] = await caller(angela).messages();
    expect(record.status).toBe("acknowledged");
    expect(record.acknowledgedAt).not.toBeNull();
  });

  it("answers a waiting request as soon as SEND is pressed", async () => {
    const hono = app();
    const added = await caller(angela).addComputer({ name: "Laptop" });
    const started = Date.now();
    const waiting = poll(hono, added.key, 10);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await caller(angela).send({ computerId: added.computer.id, target: "tlachihuani", type: "ping", level: "info", subject: "", message: "ping", ttlMinutes: 5 });
    const got = await waiting;
    expect(got.body.messages).toHaveLength(1);
    expect(Date.now() - started).toBeLessThan(3000);
  });

  it("gives a message again when Tlachihuani never acknowledged it", async () => {
    const added = await caller(angela).addComputer({ name: "Laptop" });
    const sent = await caller(angela).send({ computerId: added.computer.id, target: "tlamatini", type: "text", level: "warning", subject: "", message: "again", ttlMinutes: 60 });
    const now = new Date();
    expect(await store.takeDeliverable(added.computer.id, now, new Date(now.getTime() - 60_000))).toHaveLength(1);
    const later = new Date(now.getTime() + 61_000);
    const again = await store.takeDeliverable(added.computer.id, later, new Date(later.getTime() - 60_000));
    expect(again.map((m) => m.id)).toEqual([sent.id]);
  });

  it("expires a message nobody collected in time", async () => {
    const added = await caller(angela).addComputer({ name: "Laptop" });
    await caller(angela).send({ computerId: added.computer.id, target: "tlachihuani", type: "text", level: "info", subject: "", message: "late", ttlMinutes: 5 });
    const later = new Date(Date.now() + 6 * 60_000);
    expect(await store.takeDeliverable(added.computer.id, later, later)).toHaveLength(0);
    expect((await caller(angela).messages())[0].status).toBe("expired");
  });

  it("keeps every user to their own computers", async () => {
    const added = await caller(angela).addComputer({ name: "Laptop" });
    await expect(caller(other).send({ computerId: added.computer.id, target: "tlachihuani", type: "text", level: "info", subject: "", message: "x", ttlMinutes: 5 }))
      .rejects.toThrow();
    expect(await caller(other).computers()).toEqual([]);
    expect(await caller(other).messages()).toEqual([]);
    await expect(caller(other).removeComputer({ id: added.computer.id })).rejects.toThrow();
    await caller(angela).removeComputer({ id: added.computer.id });
    expect((await poll(app(), added.key)).status).toBe(401);
  });

  it("rejects an empty message and an unknown expiry", async () => {
    const added = await caller(angela).addComputer({ name: "Laptop" });
    await expect(caller(angela).send({ computerId: added.computer.id, target: "tlachihuani", type: "text", level: "info", subject: "", message: "   ", ttlMinutes: 5 })).rejects.toThrow();
    await expect(caller(angela).send({ computerId: added.computer.id, target: "tlachihuani", type: "text", level: "info", subject: "", message: "x", ttlMinutes: 7 })).rejects.toThrow();
  });
});

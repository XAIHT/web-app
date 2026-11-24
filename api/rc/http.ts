// Tlamatini-RC — Angela López Mendoza · XAIHT
//
// The two addresses Tlachihuani uses, authenticated by its computer key
// (Authorization: Bearer xrc_…), not by a browser session:
//
//   GET  /api/rc/poll?wait=25   waits up to 25 s; answers at once with any message
//   POST /api/rc/ack            {"ids":[…]} after the messages are in Tlachihuani.log
//
// Only outgoing HTTPS from the computer is needed, so it works on any network.
import type { Context, Env, Hono } from "hono";
import { RC_LIMITS } from "@contracts/rc";
import { beginPoll, endPoll, waitForComputer } from "./hub";
import { hashComputerKey, keyFromAuthorization } from "./keys";
import { getRcStore, type RcComputer } from "./store";
import { getRcCommandStore } from "./command-store";
import { RC_COMMAND_LIMITS, rcCommandResultInput } from "@contracts/rc-command";

type NodeBindings = { incoming?: { socket?: { remoteAddress?: string } } };

function clientIp(c: Context): string | null {
  const real = c.req.header("x-real-ip");
  if (real) return real.trim();
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (c.env as NodeBindings | undefined)?.incoming?.socket?.remoteAddress ?? null;
}

async function computerFor(c: Context): Promise<RcComputer | null> {
  const key = keyFromAuthorization(c.req.header("authorization"));
  if (!key) return null;
  return (await getRcStore().findComputerByTokenHash(hashComputerKey(key))) ?? null;
}

function seen(c: Context) {
  return {
    ip: clientIp(c),
    version: c.req.header("x-tlachihuani-version")?.slice(0, 64) ?? null,
    hostName: c.req.header("x-tlachihuani-computer")?.slice(0, 255) ?? null,
  };
}

const unauthorized = (c: Context) => {
  c.header("Cache-Control", "no-store");
  c.header("WWW-Authenticate", 'Bearer realm="xaiht.org Tlamatini-RC"');
  return c.json({ error: "This computer key is not known. Create a new key on xaiht.org → Tlamatini-RC." }, 401);
};

export function registerRcRoutes<E extends Env>(app: Hono<E>, options: { checkEveryMs?: number } = {}) {
  const checkEveryMs = options.checkEveryMs ?? 5000;

  app.get("/api/rc/poll", async (c) => {
    const computer = await computerFor(c);
    if (!computer) return unauthorized(c);
    const store = getRcStore();
    const requested = Number.parseInt(c.req.query("wait") ?? "", 10);
    const wait = Number.isFinite(requested) ? Math.min(Math.max(requested, 0), RC_LIMITS.pollWaitSeconds) : RC_LIMITS.pollWaitSeconds;
    const deadline = Date.now() + wait * 1000;
    const signal = c.req.raw.signal;
    await store.touchComputer(computer.id, seen(c), new Date());
    beginPoll(computer.id);
    try {
      for (;;) {
        // A removed computer must lose even an already waiting long poll.
        if ((await computerFor(c))?.id !== computer.id) return unauthorized(c);
        const now = new Date();
        const ready = await store.takeDeliverable(computer.id, now, new Date(now.getTime() - RC_LIMITS.redeliverAfterMs));
        // Old clients know only inert log messages. They must not lease executable
        // work that they cannot handle, leaving it stuck in a delivered state.
        const commands = c.req.header("x-tlachihuani-command-protocol") === "1"
          ? await getRcCommandStore().takeDeliverable(computer.id, now) : [];
        const remaining = deadline - Date.now();
        if (ready.length > 0 || commands.length > 0 || remaining <= 0 || signal?.aborted) {
          if ((await computerFor(c))?.id !== computer.id) return unauthorized(c);
          await store.touchComputer(computer.id, seen(c), new Date());
          c.header("Cache-Control", "no-store");
          return c.json({
            computer: { id: computer.id, name: computer.name, user_id: computer.userId },
            server_time: new Date().toISOString(),
            messages: ready.map((m) => ({ id: m.id, payload: JSON.parse(m.payload) as unknown })),
            commands: commands.map(command => ({ id: command.id, delivery_id: command.deliveryId,
              payload: JSON.parse(command.payload) as unknown })),
          });
        }
        await waitForComputer(computer.id, Math.min(checkEveryMs, remaining), signal);
      }
    } finally {
      endPoll(computer.id);
    }
  });

  app.post("/api/rc/ack", async (c) => {
    const computer = await computerFor(c);
    if (!computer) return unauthorized(c);
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Send JSON: {\"ids\": [1, 2]}" }, 400);
    }
    const raw = (body as { ids?: unknown })?.ids;
    const ids = Array.isArray(raw) ? raw.filter((id): id is number => Number.isSafeInteger(id) && id > 0).slice(0, 100) : [];
    if (ids.length === 0) return c.json({ error: "No message ids." }, 400);
    const acknowledged = await getRcStore().acknowledge(computer.id, ids, new Date());
    await getRcStore().touchComputer(computer.id, seen(c), new Date());
    c.header("Cache-Control", "no-store");
    return c.json({ acknowledged });
  });

  app.post("/api/rc/result", async (c) => {
    c.header("Cache-Control", "no-store");
    const computer = await computerFor(c);
    if (!computer) return unauthorized(c);
    // Bound actual bytes, not just an optional or attacker-controlled Content-Length.
    const reader = c.req.raw.body?.getReader();
    if (!reader) return c.json({ error: "A JSON result is required." }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        length += chunk.value.byteLength;
        if (length > RC_COMMAND_LIMITS.responseBodyBytes) {
          await reader.cancel();
          return c.json({ error: "The result exceeds the response limit." }, 413);
        }
        chunks.push(chunk.value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let raw: unknown;
    try { raw = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { return c.json({ error: "Send a valid UTF-8 JSON result." }, 400); }
    const parsed = rcCommandResultInput.safeParse(raw);
    if (!parsed.success) return c.json({ error: "Invalid result identity, sequence, status or error." }, 400);
    const input = parsed.data;
    const resultLength = new TextEncoder().encode(JSON.stringify({ ok: input.ok, result: input.result, error: input.error })).length;
    if (resultLength > RC_COMMAND_LIMITS.resultBytes) return c.json({ error: "The result exceeds the response limit. Use response.content for large answers." }, 413);
    if ((await computerFor(c))?.id !== computer.id) return unauthorized(c);
    const accepted = await getRcCommandStore().saveResult(computer.id, input, new Date());
    if (!accepted) return c.json({ error: "The operation lease is stale, revoked, expired or already completed." }, 409);
    await getRcStore().touchComputer(computer.id, seen(c), new Date());
    return c.json({ accepted: true, id: input.id, sequence: input.sequence });
  });
}

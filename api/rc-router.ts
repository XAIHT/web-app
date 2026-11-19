// Tlamatini-RC — Angela López Mendoza · XAIHT
//
// What the signed-in Tlamatini-RC page can do: list the computers connected
// through Tlachihuani (and whether each is online now), add or remove one,
// send a JSON message, and follow every message until Tlachihuani confirms it
// is written to Tlachihuani.log. Every query is limited to the signed-in user.
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  RC_LEVELS, RC_LIMITS, RC_TARGETS, RC_TTL_MINUTES, RC_TYPES, buildRcPayload,
} from "@contracts/rc";
import { createRouter, authedQuery } from "./middleware";
import { isPolling, notifyComputer } from "./rc/hub";
import { newComputerKey } from "./rc/keys";
import { getRcStore, type RcComputer, type RcMessage } from "./rc/store";

function describeComputer(computer: RcComputer, now = Date.now()) {
  const asking = isPolling(computer.id);
  const lastSeen = computer.lastSeenAt?.getTime() ?? null;
  return {
    id: computer.id,
    name: computer.name,
    keyHint: computer.tokenHint,
    hostName: computer.hostName,
    clientVersion: computer.clientVersion,
    lastIp: computer.lastIp,
    lastSeenAt: computer.lastSeenAt,
    createdAt: computer.createdAt,
    online: asking || (lastSeen !== null && now - lastSeen <= RC_LIMITS.onlineWindowMs),
    asking,
    everConnected: lastSeen !== null,
  };
}

function describeMessage(message: RcMessage, names: Map<number, string>, now = new Date()) {
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(message.payload) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  const expired = message.status === "expired" || (message.status === "queued" && message.expiresAt < now);
  return {
    id: message.id,
    computerId: message.computerId,
    computerName: names.get(message.computerId) ?? `#${message.computerId}`,
    status: expired ? ("expired" as const) : message.status,
    createdAt: message.createdAt,
    expiresAt: message.expiresAt,
    deliveredAt: message.deliveredAt,
    acknowledgedAt: message.acknowledgedAt,
    message: typeof payload.message === "string" ? payload.message : "",
    payload,
  };
}

export const rcRouter = createRouter({
  computers: authedQuery.query(async ({ ctx }) => {
    const rows = await getRcStore().listComputers(ctx.user.id);
    const now = Date.now();
    return rows.map((row) => describeComputer(row, now));
  }),

  addComputer: authedQuery
    .input(z.object({ name: z.string().trim().min(1).max(RC_LIMITS.computerName) }))
    .mutation(async ({ ctx, input }) => {
      const store = getRcStore();
      const existing = await store.listComputers(ctx.user.id);
      if (existing.length >= RC_LIMITS.computersPerUser) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `You can connect up to ${RC_LIMITS.computersPerUser} computers.` });
      }
      const { key, hash, hint } = newComputerKey();
      const computer = await store.createComputer(ctx.user.id, input.name, hash, hint);
      // The key is returned once and never stored; only its SHA-256 is kept.
      return { computer: describeComputer(computer), key };
    }),

  removeComputer: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const removed = await getRcStore().removeComputer(ctx.user.id, input.id);
      if (!removed) throw new TRPCError({ code: "NOT_FOUND", message: "That computer is not connected to your account." });
      notifyComputer(input.id);
      return { removed: true };
    }),

  send: authedQuery
    .input(z.object({
      computerId: z.number().int().positive(),
      target: z.enum(RC_TARGETS),
      type: z.enum(RC_TYPES),
      level: z.enum(RC_LEVELS),
      subject: z.string().max(RC_LIMITS.subject).default(""),
      message: z.string().trim().min(1).max(RC_LIMITS.message),
      ttlMinutes: z.number().int().refine((value) => (RC_TTL_MINUTES as readonly number[]).includes(value)),
    }))
    .mutation(async ({ ctx, input }) => {
      const store = getRcStore();
      const computer = await store.getComputer(ctx.user.id, input.computerId);
      if (!computer) throw new TRPCError({ code: "NOT_FOUND", message: "That computer is not connected to your account." });
      const sentAt = new Date();
      if (await store.countQueued(computer.id, sentAt) >= RC_LIMITS.queuedPerComputer) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Too many messages are waiting for this computer. Wait until it is online." });
      }
      const expiresAt = new Date(sentAt.getTime() + input.ttlMinutes * 60_000);
      const created = await store.createMessage(computer.id, ctx.user.id, expiresAt, (id) => JSON.stringify(buildRcPayload({
        id, sentAt, expiresAt,
        from: { userId: ctx.user.id, name: ctx.user.name ?? null },
        computer: { id: computer.id, name: computer.name },
        target: input.target, type: input.type, level: input.level,
        subject: input.subject, message: input.message,
      })));
      notifyComputer(computer.id);
      return describeMessage(created, new Map([[computer.id, computer.name]]));
    }),

  messages: authedQuery.query(async ({ ctx }) => {
    const store = getRcStore();
    const [rows, computers] = await Promise.all([store.listMessages(ctx.user.id, 25), store.listComputers(ctx.user.id)]);
    const names = new Map(computers.map((c) => [c.id, c.name]));
    const now = new Date();
    return rows.map((row) => describeMessage(row, names, now));
  }),
});

// Tlamatini-RC — Angela López Mendoza · XAIHT
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { rcCommandInput, rcIdentity, type RcCommandEnvelope, type RcCommandResponse } from "@contracts/rc-command";
import { createRouter, authedQuery } from "./middleware";
import { env } from "./lib/env";
import { notifyComputer } from "./rc/hub";
import { getRcCommandStore, RcCommandStoreError, type RcCommand } from "./rc/command-store";
import { getRcStore } from "./rc/store";

const owned = authedQuery.use(async ({ ctx, next }) => {
  ctx.resHeaders.set("Cache-Control", "no-store");
  return next();
});
const mutation = owned.use(async ({ ctx, next }) => {
  const expected = new URL(env.publicBaseUrl || ctx.req.url).origin;
  if (ctx.req.method !== "POST" || ctx.req.headers.get("origin") !== expected || ctx.req.headers.get("sec-fetch-site") === "cross-site")
    throw new TRPCError({ code: "FORBIDDEN", message: "Send remote operations from this website's signed-in page." });
  return next();
});

export function describeCommand(row: RcCommand, now = new Date()) {
  const envelope = JSON.parse(row.payload) as RcCommandEnvelope;
  return {
    id: row.id, requestId: row.requestId, computerId: row.computerId,
    operation: row.operation as RcCommandEnvelope["operation"], bindingId: row.bindingId,
    payload: envelope.payload, status: row.status === "queued" && row.expiresAt <= now ? "expired" as const : row.status,
    createdAt: row.createdAt, expiresAt: row.expiresAt, updatedAt: row.updatedAt,
    response: row.response ? JSON.parse(row.response) as RcCommandResponse : null,
  };
}

export const rcCommandRouter = createRouter({
  send: mutation.input(rcCommandInput).mutation(async ({ ctx, input }) => {
    try {
      const row = await getRcCommandStore().create(ctx.user.id, ctx.user.name ?? null, input, new Date());
      notifyComputer(row.computerId);
      return describeCommand(row);
    } catch (error) {
      if (error instanceof RcCommandStoreError) throw new TRPCError({
        code: error.code === "not_found" ? "NOT_FOUND" : error.code === "conflict" ? "CONFLICT" : "TOO_MANY_REQUESTS",
        message: error.message,
      });
      throw error;
    }
  }),
  cancelQueued: mutation.input(z.object({ computerId: z.number().int().positive().safe(), requestId: rcIdentity }).strict())
    .mutation(async ({ ctx, input }) => {
      try {
        const row = await getRcCommandStore().cancelQueued(ctx.user.id, input.computerId, input.requestId, new Date());
        notifyComputer(input.computerId);
        return describeCommand(row);
      } catch (error) {
        if (error instanceof RcCommandStoreError) throw new TRPCError({ code: error.code === "not_found" ? "NOT_FOUND" : "CONFLICT", message: error.message });
        throw error;
      }
    }),
  get: owned.input(z.object({ computerId: z.number().int().positive().safe(), requestId: rcIdentity }).strict())
    .query(async ({ ctx, input }) => {
      const row = await getRcCommandStore().get(ctx.user.id, input.computerId, input.requestId);
      return row ? describeCommand(row) : null;
    }),
  recent: owned.input(z.object({ computerId: z.number().int().positive().safe() }).strict())
    .query(async ({ ctx, input }) => {
      if (!await getRcStore().getComputer(ctx.user.id, input.computerId)) return [];
      return (await getRcCommandStore().recent(ctx.user.id, input.computerId)).map(row => describeCommand(row));
    }),
});

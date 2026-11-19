import { authRouter } from "./auth-router";
import { notesRouter } from "./notes-router";
import { rcRouter } from "./rc-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  notes: notesRouter,
  rc: rcRouter,
});

export type AppRouter = typeof appRouter;

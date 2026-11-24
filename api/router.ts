import { authRouter } from "./auth-router";
import { notesRouter } from "./notes-router";
import { rcRouter } from "./rc-router";
import { rcCommandRouter } from "./rc-command-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  notes: notesRouter,
  rc: rcRouter,
  rcCommands: rcCommandRouter,
});

export type AppRouter = typeof appRouter;

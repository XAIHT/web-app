// Tlamatini-RC local check server — Angela López Mendoza · XAIHT
//
// Runs the real Tlamatini-RC page (built into dist/public by `npx vite build`),
// the real tRPC router and the real /api/rc/poll and /api/rc/ack routes on this
// computer, with a memory store instead of Cloud SQL and one fixed signed-in
// test user instead of Google sign-in. Nothing here is part of the deployed app.
//
//   npx vite build
//   npx tsx --tsconfig tsconfig.server.json scripts/rc-local-server.ts 8095
import fs from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { User } from "../db/schema";
import { authRouter } from "../api/auth-router";
import { createRouter, publicQuery } from "../api/middleware";
import { rcRouter } from "../api/rc-router";
import { registerRcRoutes } from "../api/rc/http";
import { createMemoryRcStore } from "../api/rc/memory-store";
import { setRcStore } from "../api/rc/store";
import { rcCommandRouter } from "../api/rc-command-router";
import { createMemoryRcCommandStore } from "../api/rc/memory-command-store";
import { setRcCommandStore } from "../api/rc/command-store";
import { env } from "../api/lib/env";

const port = Number.parseInt(process.argv[2] ?? "8095", 10);
if (!Number.isInteger(port) || [8000, 8052, 12064, 3000].includes(port)) {
  console.error(`Refusing port ${process.argv[2]}: choose a free test port such as 8095.`);
  process.exit(2);
}
const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "dist", "public");
if (!fs.existsSync(path.join(publicDir, "index.html"))) {
  console.error("dist/public/index.html is missing. Run `npx vite build` first.");
  process.exit(2);
}

const now = new Date();
const testUser: User = {
  id: 1, unionId: "local-check", name: "Angela López Mendoza (local check)", email: null, avatar: null,
  role: "user", createdAt: now, updatedAt: now, lastSignInAt: now,
};
setRcStore(createMemoryRcStore());
setRcCommandStore(createMemoryRcCommandStore());
// Isolated local harness only: production keeps its configured public origin.
env.publicBaseUrl = `http://127.0.0.1:${port}`;

const router = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  rc: rcRouter,
  rcCommands: rcCommandRouter,
});

const app = new Hono();
app.use("/api/trpc/*", (c) => fetchRequestHandler({
  endpoint: "/api/trpc",
  req: c.req.raw,
  router,
  createContext: ({ req, resHeaders }) => ({ req, resHeaders, user: testUser }),
}));
registerRcRoutes(app);
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));
app.use("*", serveStatic({ root: path.relative(process.cwd(), publicDir) || "." }));
app.notFound((c) => c.html(fs.readFileSync(path.join(publicDir, "index.html"), "utf-8")));

serve({ fetch: app.fetch, port, hostname: "127.0.0.1" }, () => {
  console.log(`Tlamatini-RC local check server on http://127.0.0.1:${port}/tlamatini-rc (memory store, test user)`);
});

# The Architecture of the XAIHT Web-App

> A field guide to how the `web-app` codebase fits together — every diagram in
> this document is hand-drawn in monospace ASCII so it reads cleanly in any
> terminal, any Markdown viewer, and (printed verbatim) any presentation slide.
>
> Pair this with `BookOfTlamatini.md` for the agent-side story. This file is
> only about **the web-app**: the React SPA, the Hono + tRPC server, the
> MySQL/Drizzle data layer, the Google OAuth session, and the GCP delivery
> pipeline that ships it all to `xaiht.org`.

---

## Table of contents

- **Part I — The 10,000-foot view**
  - 1. The big picture
  - 2. The single-process rule
  - 3. Where the code lives
- **Part II — The Frontend**
  - 4. Bootstrap chain
  - 5. Pages and component composition
  - 6. The `useAuth` state machine
- **Part III — The Backend**
  - 7. HTTP entry points
  - 8. The tRPC pipeline (per call)
  - 9. The tRPC router tree (public API surface)
- **Part IV — Data**
  - 10. The database (users + notes)
  - 11. How Drizzle is wired
- **Part V — Identity**
  - 12. OAuth sign-in, end to end
  - 13. The kimi_sid cookie
- **Part VI — Two representative request lifecycles**
  - 14. `notes.create` — an authenticated mutation
  - 15. A cold page load — what happens before React renders
- **Part VII — Contracts: the type bridge**
  - 16. Who imports what from `contracts/`
- **Part VIII — Build, ship, run**
  - 17. The three npm scripts
  - 18. The Dockerfile, stage by stage
  - 19. The Jenkins → GCP pipeline
  - 20. Runtime configuration
- **Part IX — Reference cards**
  - 21. Tech stack at a glance
  - 22. One-page mental model

---

# Part I — The 10,000-foot view

## 1. The big picture

The web-app is a **single Node process** that does three jobs at once: it
serves the React SPA as static files, it handles `/api/oauth/*` for Google
sign-in, and it dispatches `/api/trpc/*` to the procedures the SPA calls.
Everything authenticated rides on a single HTTP-only cookie called `kimi_sid`.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser (React 19 SPA, served by the same Hono process)            │
│  pages:  Home   /   Tlamatini   /   Login   /   NotFound            │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  HTTPS   (cookie:  kimi_sid)
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Hono server   (api/boot.ts,   Node 20)                             │
│   /api/oauth/start    /api/oauth/callback    /api/trpc/*    /*      │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌──────────────────┐   ┌────────────────────┐   ┌─────────────────────┐
│  OAuth handlers  │   │  tRPC pipeline     │   │  Static SPA         │
│  kimi/auth.ts    │   │  context → auth →  │   │  dist/public/       │
│  kimi/session.ts │   │  router → query    │   │  (Vite bundle)      │
└────────┬─────────┘   └──────────┬─────────┘   └─────────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│  Google OAuth 2.0       │  │  MySQL  (PlanetScale)    │
│  accounts.google.com    │  │  Drizzle ORM             │
└─────────────────────────┘  └──────────────────────────┘
```

Read it top to bottom: the browser only ever talks to *one* origin, the Hono
server fans out to one of three responsibilities, and only two of those
reach outside the box — Google for identity and MySQL for state.

## 2. The single-process rule

There is no separate API service, no separate static-file CDN, no separate
worker pool, no Cloud Run, no Kubernetes. **One** Node process, started by
`node dist/boot.js`, supervised by `systemd` on a Compute Engine VM, exposed
through Cloudflare. This is deliberate — see `feedback_compute_over_serverless.md`
in your memory.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  ┌────────────────────────┐                      │
│                  │   node dist/boot.js    │   ← one process      │
│                  └────────────────────────┘                      │
│                              │                                   │
│        ┌─────────────────────┼─────────────────────┐             │
│        ▼                     ▼                     ▼             │
│   serves SPA           handles OAuth          handles tRPC       │
│   (dist/public)        (/api/oauth/*)         (/api/trpc/*)      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼  systemctl restart xaiht-app
                  ┌────────────────────────┐
                  │  GCP Compute Engine VM │
                  │  136.116.194.179       │
                  └────────────────────────┘
```

## 3. Where the code lives

A folder-by-folder map. Four "code" folders own logic; three "plumbing"
folders hold generated or static assets; a handful of root files configure
how everything is built and shipped.

```
web-app/
│
├── src/                        React + TypeScript frontend
│   ├── main.tsx                SPA entry, wires providers
│   ├── App.tsx                 Router definitions
│   ├── pages/                  Home, Tlamatini, Login, NotFound
│   ├── components/             Navigation, Footer, NoteEditor, FX
│   ├── components/ui/          Radix + shadcn primitives  (40+)
│   ├── hooks/                  useAuth, useNotes, use-mobile
│   ├── providers/              trpc.tsx
│   ├── lib/                    trpc.ts, utils.ts
│   ├── store.ts                localStorage notes (legacy/local)
│   └── config.ts               UI config + 11 starter notes
│
├── api/                        Hono + tRPC backend
│   ├── boot.ts                 Server entry, HTTP routes
│   ├── router.ts               tRPC appRouter
│   ├── context.ts              tRPC createContext
│   ├── middleware.ts           publicQuery / authedQuery / adminQuery
│   ├── auth-router.ts          auth.me, auth.logout
│   ├── notes-router.ts         notes.{list,get,create,update,delete}
│   ├── kimi/                   OAuth + session  (auth.ts, session.ts)
│   ├── queries/                connection.ts (getDb), users.ts
│   └── lib/                    env.ts, cookies.ts, http.ts, vite.ts
│
├── db/                         Drizzle schema + migrations
│   ├── schema.ts               users, notes tables
│   ├── relations.ts            FK relations
│   └── migrations/             generated SQL files
│
├── contracts/                  Shared between FE and BE
│   ├── constants.ts            Session, Paths, ErrorMessages
│   ├── types.ts                re-exports of db/schema types
│   └── errors.ts               error factories
│
├── public/                     static assets served as-is
├── scripts/                    build-server.mjs  (esbuild bundle)
├── dist/                       build output  (public/  +  boot.js)
│
├── package.json                dev / build / start / db:*   scripts
├── vite.config.ts              aliases:  @  @contracts  @db
├── drizzle.config.ts           MySQL DSN → db/migrations/
├── Dockerfile                  multi-stage Node 20 alpine
├── Jenkinsfile                 build → push → ssh → restart
└── index.html                  SPA root, loads /src/main.tsx
```

Three rules to internalize from this map:

- **`src/` may import `@contracts` and `@db` types**, but never `api/*`.
- **`api/` may import `@contracts` and `@db`**, but never `src/*`.
- The only thing that crosses the line at runtime is the HTTP wire format
  (cookies, JSON, the tRPC envelope). The only thing that crosses it at
  compile time is the `AppRouter` *type*, imported `import type` only.

---

# Part II — The Frontend

## 4. Bootstrap chain

What happens between "browser receives `index.html`" and "React mounts your
first page". This is the chain you have to imagine in your head whenever you
think about HMR, hydration, or which provider can see what.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser fetches  index.html                                        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  <script src="/src/main.tsx">
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  src/main.tsx                                                       │
│                                                                     │
│    createRoot(#root).render(                                        │
│      <BrowserRouter>                                                │
│        <TRPCProvider>                                               │
│          <App />                                                    │
│        </TRPCProvider>                                              │
│      </BrowserRouter>                                               │
│    )                                                                │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐   ┌─────────────────────┐   ┌────────────────────┐
│  React Router    │   │  TRPCProvider       │   │  src/App.tsx       │
│   /              │   │  providers/trpc.tsx │   │   <Routes>         │
│   /tlamatini     │   │   ─ tRPC client     │   │   switches pages   │
│   /login         │   │   ─ QueryClient     │   │                    │
│   /*  (NotFound) │   │   ─ httpBatchLink   │   │                    │
│                  │   │     → /api/trpc     │   │                    │
│                  │   │   ─ superjson       │   │                    │
│                  │   │   ─ credentials:    │   │                    │
│                  │   │     "include"       │   │                    │
└──────────────────┘   └─────────────────────┘   └─────────┬──────────┘
                                                            │
                                                            ▼
                                       ┌───────────────────────────────┐
                                       │  Home   Tlamatini   Login     │
                                       │  NotFound                     │
                                       └───────────────────────────────┘
```

The cookie does *not* show up in this diagram, but it is the silent passenger
of every fetch the tRPC client makes — `credentials: "include"` is what
allows `kimi_sid` to be sent on `POST /api/trpc/*`.

## 5. Pages and component composition

The whole SPA is four top-level pages plus a shared component library. The
following diagram shows each page expanded into its main sections; the
Radix/shadcn primitives all four pages draw from are at the bottom.

```
┌─────────────────────────────── App.tsx ────────────────────────────────┐
│                                                                        │
│   "/"  ───────────────►  Home.tsx                                      │
│                            │                                           │
│                            ├─► Navigation                              │
│                            ├─► AsciiIntro  /  MoonlitRipple  /  FX     │
│                            ├─► OverviewSection                         │
│                            ├─► VisionMissionSection                    │
│                            ├─► ArchitectureSection                     │
│                            ├─► WorkflowSection                         │
│                            ├─► ToolsSection                            │
│                            └─► Footer                                  │
│                                                                        │
│   "/tlamatini" ───────►  Tlamatini.tsx                                 │
│                            │                                           │
│                            ├─► Navigation                              │
│                            ├─► TlamatiniHero                           │
│                            ├─► TlamatiniOverview  /  Features          │
│                            ├─► TlamatiniInstallation  /  Agents        │
│                            ├─► TlamatiniTechStack                      │
│                            └─► Footer                                  │
│                                                                        │
│   "/login" ──────────►  Login.tsx                                      │
│                            │                                           │
│                            ├─► Navigation                              │
│                            ├─► useAuth()   (calls trpc.auth.me)        │
│                            └─► <a href="/api/oauth/start">             │
│                                  Sign in with Google                   │
│                                                                        │
│   "/*" ──────────────►  NotFound.tsx                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │  every page eventually draws from:
                                  ▼
┌────────────────── src/components/ui/   (Radix + shadcn) ───────────────┐
│  button    card     dialog    dropdown-menu    input    textarea       │
│  table     tabs     select    popover          tooltip  switch         │
│  sheet     sidebar  avatar    badge            skeleton spinner    …   │
└────────────────────────────────────────────────────────────────────────┘
```

The "feature" components — `NoteEditor`, `GraphView`, `FlowField` — exist for
a notes/graph workflow that is currently unrouted (it lives in `store.ts` +
local hooks and would attach under a `/notes` route in a future iteration).

## 6. The `useAuth` state machine

`useAuth` is the single source of truth for "is anyone signed in?" in the
SPA. Every page that needs to know the answer calls this hook — it wraps
`trpc.auth.me` with the right caching, retry, and redirect behavior.

```
                       ┌──────────────────────────┐
                       │  Component mounts        │
                       │  calls useAuth({...})    │
                       └────────────┬─────────────┘
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │  trpc.auth.me.useQuery   │
                       │   staleTime:  5 minutes  │
                       │   retry:      0 on 401   │
                       └────────────┬─────────────┘
                                    │
                          POST  /api/trpc/auth.me
                          (cookie kimi_sid)
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
       200 OK  +  user        401 Unauthorized       Network error
              │                     │                     │
              ▼                     ▼                     ▼
   ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
   │ isAuthenticated:   │ │ isAuthenticated:   │ │ isLoading: true    │
   │   true             │ │   false            │ │ retries paused on  │
   │ user: User         │ │ user: null         │ │ 401, otherwise     │
   │ isLoading: false   │ │ isLoading: false   │ │ React Query retry  │
   └────────┬───────────┘ └────────┬───────────┘ └────────────────────┘
            │                      │
            │                      │  opts.redirectOnUnauthenticated?
            │                      ▼
            │            ┌────────────────────┐
            │            │ window.location =  │
            │            │ "/api/oauth/start" │
            │            └────────────────────┘
            ▼
   ┌──────────────────────────────┐
   │ caller may call logout()     │
   │   → trpc.auth.logout.mut()   │
   │   → Set-Cookie maxAge=0      │
   │   → query invalidates        │
   │   → state collapses to       │
   │     "401 Unauthorized" path  │
   └──────────────────────────────┘
```

The "fails open" detail worth remembering: the hook never auto-redirects
unless the caller explicitly opts in via `redirectOnUnauthenticated: true`.
Pages like `Login.tsx` and `Home.tsx` consume an "unauthenticated" state
without bouncing — they just render the signed-out version of the page.

---

# Part III — The Backend

## 7. HTTP entry points

The Hono app in `api/boot.ts` exposes exactly four entry shapes. Three serve
the application; the fourth is the static-file fallback that lets the SPA's
deep links (`/tlamatini`, `/login`, …) survive a refresh.

```
                           Inbound HTTP request
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  api/boot.ts    (Hono root app)                                     │
└─────────────────────────────────────────────────────────────────────┘
        │             │                   │                  │
        ▼             ▼                   ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ ┌─────────────┐
│ GET          │ │ GET          │ │ POST / GET       │ │ GET   /*    │
│ /api/oauth/  │ │ /api/oauth/  │ │ /api/trpc/*      │ │ (anything   │
│ start        │ │ callback     │ │                  │ │  else)      │
├──────────────┤ ├──────────────┤ ├──────────────────┤ ├─────────────┤
│ createOAuth  │ │ createOAuth  │ │ fetchRequest     │ │ static SPA  │
│ StartHandler │ │ Callback     │ │ Handler({        │ │ from        │
│              │ │ Handler      │ │   router,        │ │   dist/     │
│ build state, │ │ exchange     │ │   createContext, │ │   public/   │
│ redirect to  │ │ code, fetch  │ │ })               │ │             │
│ Google       │ │ profile,     │ │                  │ │             │
│              │ │ upsert user, │ │ → appRouter      │ │             │
│              │ │ sign JWT     │ │   procedures     │ │             │
└──────────────┘ └──────┬───────┘ └────────┬─────────┘ └─────────────┘
                        │                  │
                        ▼                  │
              ┌─────────────────────┐      │
              │  Set-Cookie         │      │
              │    kimi_sid = JWT   │      │
              │  HttpOnly · Lax     │      │
              │  Secure (off local) │      │
              │  302  →  /          │      │
              └─────────────────────┘      │
                                           ▼
                                ┌────────────────────────────┐
                                │  JSON envelope             │
                                │  (superjson serialized)    │
                                │  200 OK / 4xx / 5xx        │
                                └────────────────────────────┘
```

In production, the static-files fallback (`GET /*`) is what makes the SPA
*feel* like a normal website: refresh `/tlamatini`, the server returns
`index.html`, and React Router re-resolves the URL on the client.

## 8. The tRPC pipeline (per call)

Every request to `/api/trpc/*` walks the same three-stage pipeline before
its procedure body even runs. This is where authentication and validation
are enforced.

```
┌─────────────────────────────────────────────────────────────────────┐
│  /api/trpc/<procedure>     (one request)                            │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  createContext(opts)           │
                  │  api/context.ts                │
                  │                                │
                  │   ─ read cookie kimi_sid       │
                  │   ─ authenticateRequest()      │
                  │       • verifySessionToken     │
                  │       • findUserByUnionId      │
                  │   ─ silent on auth failure     │
                  │     (ctx.user stays undefined) │
                  │                                │
                  │  → ctx = { req, headers, user }│
                  └────────────────┬───────────────┘
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  middleware  (per procedure)   │
                  │  api/middleware.ts             │
                  │                                │
                  │   ─ publicQuery   no check     │
                  │   ─ authedQuery   requireAuth  │
                  │   ─ adminQuery    requireRole  │
                  │                                │
                  │  throws TRPCError 401 / 403    │
                  │  if the check fails            │
                  └────────────────┬───────────────┘
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  procedure body                │
                  │                                │
                  │   ─ Zod validates input        │
                  │   ─ getDb() → Drizzle query    │
                  │   ─ returns a plain value      │
                  └────────────────┬───────────────┘
                                   │
                                   ▼
                  ┌────────────────────────────────┐
                  │  superjson serialize           │
                  │  → 200 OK to client            │
                  │  (Dates, Maps, BigInts safe)   │
                  └────────────────────────────────┘
```

Two non-obvious details:

- `createContext` **never throws** on a bad cookie. It just leaves
  `ctx.user` empty. Whether that is an error is up to the middleware on the
  individual procedure — `auth.me` is `authedQuery` and throws 401, while
  `ping` is `publicQuery` and happily replies anyway.
- Drizzle's client is obtained through `getDb()`, which is a lazy-init
  singleton. The first procedure to fire opens the MySQL pool; all later
  procedures reuse it.

## 9. The tRPC router tree (public API surface)

This is the full menu of remote procedures the SPA can call. Treat it as
the canonical API reference — if it's not on this tree, the SPA can't ask
the server to do it.

```
┌──────────────────────── appRouter   (api/router.ts) ───────────────────┐
│                                                                        │
│  ping                          public.query     →  { ok, ts }          │
│                                                                        │
│  ├─ auth/                                                              │
│  │    ├─ me                    authed.query     →  User                │
│  │    └─ logout                authed.mutation  →  clears kimi_sid     │
│  │                                                                     │
│  └─ notes/                                                             │
│       ├─ list                  authed.query     →  Note[]              │
│       │                         (auto-seeds 11 starter notes once)     │
│       ├─ get        ({ id })   authed.query     →  Note                │
│       ├─ create     ({...})    authed.mutation  →  { id }              │
│       ├─ update     ({...})    authed.mutation  →  void                │
│       ├─ delete     ({ id })   authed.mutation  →  void                │
│       └─ deleteMany ({ ids })  authed.mutation  →  void                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

   public.query        →  anyone can call
   authed.query / mut. →  requires a valid kimi_sid cookie  (else 401)
```

The asymmetry to notice: there is no public mutation. Anything that *changes*
state requires a signed-in user — which means the cookie, which means the
JWT, which means a successful Google OAuth round-trip at some point in the
past year.

---

# Part IV — Data

## 10. The database (users + notes)

The schema is small on purpose. Two tables, a one-to-many relation, and a
natural key (`unionId`) that lets Google's identity model thread cleanly
through to ours.

```
┌─────────────────────────────────────┐         ┌─────────────────────────────────────┐
│  users                              │         │  notes                              │
├─────────────────────────────────────┤         ├─────────────────────────────────────┤
│  id            serial      PK       │ 1     * │  id            serial      PK       │
│  unionId       varchar(255) UNIQUE  │◄────────┤  userId        bigint     FK→users  │
│  name          varchar(255)         │         │  title         varchar(500)         │
│  email         varchar(320)         │         │  content       text                 │
│  avatar        text                 │         │  tags          json    (string[])   │
│  role          enum(user | admin)   │         │  source        text    NULLABLE     │
│  createdAt     timestamp            │         │  createdAt     timestamp            │
│  updatedAt     timestamp            │         │  updatedAt     timestamp            │
│  lastSignInAt  timestamp            │         │                                     │
└─────────────────────────────────────┘         └─────────────────────────────────────┘

   ─ unionId  is the Google "sub" claim — the natural key for identity.
   ─ Every foreign key in the system ultimately points at users.id.
   ─ role is the single authorization axis; adminQuery checks it.
```

`role` is the only authorization knob in the database — the `requireRole`
middleware reads exactly this field. There is no per-row permission system
yet; every note is owned by exactly one user and a query without
`WHERE userId = ctx.user.id` would be a bug.

## 11. How Drizzle is wired

A short diagram, but worth drawing: it explains why touching the schema
forces a regeneration step.

```
   db/schema.ts          ───┐
   db/relations.ts       ───┤
                            │
                            ▼
                  ┌────────────────────────┐
                  │  drizzle-kit           │
                  │  reads schema +        │
                  │  diffs against DB      │
                  └──────┬─────────────────┘
                         │
                         ▼
                  ┌────────────────────────┐
                  │  db/migrations/*.sql   │   ← committed to git
                  └──────┬─────────────────┘
                         │
                         ▼
                  ┌────────────────────────┐
                  │  npm run db:migrate    │
                  │  → MySQL applies SQL   │
                  └────────────────────────┘

                  Runtime (separate path):

                  api/queries/connection.ts
                        │
                        ▼
                  ┌────────────────────────┐
                  │  getDb()  (singleton)  │
                  │   drizzle(mysql2pool,  │
                  │     { schema,          │
                  │       relations })     │
                  └────────────────────────┘
```

Workflow: edit `db/schema.ts` → `npm run db:generate` → review the new SQL
in `db/migrations/` → commit → `npm run db:migrate` against the target DB.
Do not edit migrations by hand.

---

# Part V — Identity

## 12. OAuth sign-in, end to end

The full Google sign-in dance, with every actor on its own lifeline.
Time flows down. Notice that the JWT is created entirely server-side; the
SPA never sees a token, only the `Set-Cookie` header on the redirect.

```
   User           SPA             Hono  /api      Google         MySQL
    │              │                  │             │              │
    │ open /login  │                  │             │              │
    ├─────────────►│                  │             │              │
    │              │                  │             │              │
    │   click "Sign in with Google"   │             │              │
    │              ├─ GET /api/oauth/start ────────►│              │
    │              │                  │             │              │
    │              │   302 → accounts.google.com    │              │
    │              │◄─────────────────┤             │              │
    │              │                  │             │              │
    │  authenticate + consent         │             │              │
    ├────────────────────────────────────────────►  │              │
    │   302 → /api/oauth/callback?code=...          │              │
    │◄──────────────────────────────────────────────┤              │
    │              │                  │             │              │
    │  GET /api/oauth/callback?code…  │             │              │
    ├────────────────────────────────►│             │              │
    │              │                  │             │              │
    │              │                  │ exchangeAuthCode(code)     │
    │              │                  ├────────────►│              │
    │              │                  │◄────────────┤ access_token │
    │              │                  │             │              │
    │              │                  │ fetchGoogleUserInfo(tok)   │
    │              │                  ├────────────►│              │
    │              │                  │◄────────────┤ {sub,name,…} │
    │              │                  │             │              │
    │              │                  │  upsertUser({unionId=sub}) │
    │              │                  ├───────────────────────────►│
    │              │                  │◄───────────────────────────┤
    │              │                  │             │              │
    │              │                  │ signSessionToken (HS256)   │
    │              │                  │ 1-year JWT                 │
    │              │                  │             │              │
    │   Set-Cookie kimi_sid=JWT   +   302 → /       │              │
    │◄────────────────────────────────┤             │              │
    │              │                  │             │              │
    │  loads "/"   │                  │             │              │
    ├─────────────►│                  │             │              │
    │              │ tRPC auth.me  (cookie sent)    │              │
    │              ├─────────────────►│             │              │
    │              │                  │ verify JWT, find user      │
    │              │                  ├───────────────────────────►│
    │              │                  │◄───────────────────────────┤
    │              │◄─────────────────┤  user payload              │
    │              │                  │             │              │
    │  authenticated UI               │             │              │
    │◄─────────────┤                  │             │              │
    ▼              ▼                  ▼             ▼              ▼
```

The `state` parameter that Google bounces back is a base64-encoded copy of
the original `redirect_uri`. That makes the callback handler self-contained:
it doesn't need server-side session storage to remember where to send the
user next.

## 13. The kimi_sid cookie

Everything about the cookie in one picture, because cookie misconfigurations
account for an outsized share of "why am I logged out?" bugs.

```
   ┌──────────────────────────────────────────────────────────────┐
   │  Cookie name :   kimi_sid                                    │
   │  Value       :   <HS256 JWT>                                 │
   │                  ─────────                                   │
   │                  header.payload.signature                    │
   │                                                              │
   │                  payload = {                                 │
   │                    unionId  : "<google sub>",                │
   │                    clientId : "google",                      │
   │                    iat      : <issue time>,                  │
   │                    exp      : <iat + 365 days>               │
   │                  }                                           │
   │                                                              │
   │  Attributes  :   HttpOnly                                    │
   │                  SameSite=Lax                                │
   │                  Secure          (off on localhost)          │
   │                  Path=/                                      │
   │                  Max-Age=31536000   (365 days)               │
   │                                                              │
   │  Signing key :   APP_SECRET   (env var, stable, 32+ bytes)   │
   └──────────────────────────────────────────────────────────────┘

   ─ HttpOnly        → invisible to JS, immune to XSS exfiltration.
   ─ SameSite=Lax    → not sent on cross-site POSTs, but sent on top-level GETs.
   ─ credentials:    → tRPC client sends the cookie on every /api/trpc/* call.
       "include"
   ─ Logout          → server replies with the same cookie name and Max-Age=0.
```

If you ever need to *rotate* `APP_SECRET`, every existing JWT becomes
invalid and every signed-in user is silently logged out the next time
their SPA tries `auth.me`. This is by design — no separate revocation list.

---

# Part VI — Two representative request lifecycles

## 14. `notes.create` — an authenticated mutation

The canonical "user does a thing" path. Every authed mutation in the system
follows this exact shape: context → middleware → Zod → Drizzle → cache
invalidation on the way back.

```
   Component (React)            tRPC + React Query           Hono + tRPC                MySQL
        │                              │                          │                       │
        │ trpc.notes.create.useMutation│                          │                       │
        ├─────────────────────────────►│                          │                       │
        │   ({ title, content })       │                          │                       │
        │                              │ POST /api/trpc/notes.create  (cookie kimi_sid)   │
        │                              ├─────────────────────────►│                       │
        │                              │                          │                       │
        │                              │                          │ createContext()       │
        │                              │                          │  ─ verify JWT         │
        │                              │                          │  ─ SELECT user        │
        │                              │                          ├──────────────────────►│
        │                              │                          │◄──────────────────────┤
        │                              │                          │  ctx.user populated   │
        │                              │                          │                       │
        │                              │                          │ requireAuth ✓         │
        │                              │                          │ Zod validates input   │
        │                              │                          │                       │
        │                              │                          │ db.insert(notes)…     │
        │                              │                          ├──────────────────────►│
        │                              │                          │◄──────────────────────┤
        │                              │                          │   insertId            │
        │                              │                          │                       │
        │                              │  200  { id }             │                       │
        │                              │◄─────────────────────────┤                       │
        │                              │                          │                       │
        │                              │ invalidate notes.list    │                       │
        │  re-render with new item     │                          │                       │
        │◄─────────────────────────────┤                          │                       │
        ▼                              ▼                          ▼                       ▼
```

The "invalidate `notes.list`" step is the secret to optimistic-feeling UI.
React Query's cache key for the list query is invalidated the moment the
mutation succeeds, so any mounted component that reads it refetches
automatically.

## 15. A cold page load — what happens before React renders

A user types `https://xaiht.org/tlamatini` into a brand-new browser tab.
This walks through every layer before the first pixel is painted.

```
   Browser              Cloudflare           Hono on VM                MySQL
      │                     │                    │                      │
      │  DNS xaiht.org      │                    │                      │
      ├────────────────────►│                    │                      │
      │  TLS handshake      │                    │                      │
      │◄───────────────────►│                    │                      │
      │                     │                    │                      │
      │  GET /tlamatini     │                    │                      │
      ├────────────────────►│                    │                      │
      │                     │  origin pull       │                      │
      │                     ├───────────────────►│                      │
      │                     │                    │  GET /tlamatini      │
      │                     │                    │  ─ does not match    │
      │                     │                    │    /api/* routes     │
      │                     │                    │  ─ falls through to  │
      │                     │                    │    static handler    │
      │                     │                    │  ─ returns           │
      │                     │                    │    dist/public/      │
      │                     │                    │      index.html      │
      │                     │◄───────────────────┤                      │
      │  200  index.html    │                    │                      │
      │◄────────────────────┤                    │                      │
      │                     │                    │                      │
      │  parse HTML, schedule fetches for:                              │
      │   /assets/index-XXXX.js   /assets/index-XXXX.css                │
      ├────────────────────►│───────────────────►│                      │
      │◄────────────────────┤◄───────────────────┤                      │
      │                     │                    │                      │
      │  main.tsx runs                                                  │
      │  React Router resolves /tlamatini → Tlamatini.tsx               │
      │  Tlamatini renders (no auth needed for public content)          │
      │                     │                    │                      │
      │  if useAuth() is on this page:                                  │
      │  POST /api/trpc/auth.me   (cookie kimi_sid if present)          │
      ├────────────────────►│───────────────────►│                      │
      │                     │                    │ verify JWT, SELECT   │
      │                     │                    │ user from MySQL      │
      │                     │                    ├─────────────────────►│
      │                     │                    │◄─────────────────────┤
      │                     │                    │                      │
      │  200  user / 401    │                    │                      │
      │◄────────────────────┤◄───────────────────┤                      │
      │                                                                 │
      │  Re-render with authenticated nav (or stay anonymous)           │
      ▼                                                                 ▼
```

Two performance levers to keep in mind: the SPA bundle is the only thing
on the **critical path** — `auth.me` is fired *after* React mounts, so a
slow MySQL doesn't delay first paint. And Cloudflare caches the static
assets aggressively, so for repeat visitors steps 1–4 collapse to "served
from edge".

---

# Part VII — Contracts: the type bridge

## 16. Who imports what from `contracts/`

`contracts/` is the demilitarized zone between frontend and backend. It has
**zero runtime dependencies** on either side; it exists purely so both sides
can agree on the same string constants and the same TypeScript types
without one side reaching into the other.

```
┌────────────────────────── contracts/ ──────────────────────────┐
│                                                                │
│   constants.ts                                                 │
│     ─ Session.cookieName  = "kimi_sid"                         │
│     ─ Session.maxAgeMs    = 1 year                             │
│     ─ Paths.login         = "/login"                           │
│     ─ Paths.oauthStart    = "/api/oauth/start"                 │
│     ─ Paths.oauthCallback = "/api/oauth/callback"              │
│     ─ ErrorMessages.{ unauthenticated, insufficientRole }      │
│                                                                │
│   types.ts                                                     │
│     ─ re-exports User, Note, InsertUser, InsertNote            │
│       from db/schema.ts                                        │
│     ─ re-exports errors from errors.ts                         │
│                                                                │
│   errors.ts                                                    │
│     ─ TRPCError factory helpers                                │
│                                                                │
└────────────────┬────────────────────────────┬──────────────────┘
                 │                            │
   @contracts    │  vite alias                │  @contracts vite alias
                 ▼                            ▼
┌────────────────────────────────┐  ┌────────────────────────────────┐
│  src/   (frontend)             │  │  api/   (backend)              │
│    pages/Login.tsx             │  │    auth-router.ts              │
│    hooks/useAuth.ts            │  │    notes-router.ts             │
│    lib/trpc.ts                 │  │    kimi/auth.ts                │
│      (imports AppRouter type   │  │    context.ts                  │
│       from api/router only)    │  │                                │
└────────────────────────────────┘  └────────────────────────────────┘
                 ▲                            ▲
                 │  type-only AppRouter       │
                 └──────────┬─────────────────┘
                            │
                ┌───────────┴─────────────┐
                │  api/router.ts          │
                │  export type AppRouter  │
                └─────────────────────────┘
```

End-to-end type safety in this codebase is the product of two things:

1. **`AppRouter` type import on the client.** `src/lib/trpc.ts` does
   `import type { AppRouter } from "@/api/router"`. The `import type` is
   important — it gets erased at compile time, so the frontend bundle has
   no runtime dependency on the server code.
2. **Shared row types via `contracts/types.ts`.** Both sides reach for the
   *same* `User` and `Note` types, sourced from `db/schema.ts`. If you add
   a column, both sides break in the same place.

---

# Part VIII — Build, ship, run

## 17. The three npm scripts

Every operational state of the app is one of three npm scripts. Knowing
which one is running tells you immediately what code is on disk and how
the SPA was served.

```
┌──────────────────────────── dev   (developer machine) ─────────────────────────────┐
│                                                                                    │
│   npm run dev                                                                      │
│        │                                                                           │
│        ▼                                                                           │
│   vite dev   +   @hono/vite-dev-server   (entry api/boot.ts)                       │
│        │                                                                           │
│        ├──► serves SPA with HMR for src/                                           │
│        └──► proxies /api/* into the in-process Hono app                            │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────── build   (CI or local) ──────────────────────────────────┐
│                                                                                    │
│   npm run build                                                                    │
│        │                                                                           │
│        ├──► vite build                  ──► dist/public/        (SPA bundle)       │
│        │                                                                           │
│        └──► node scripts/build-server.mjs                                          │
│                  esbuild --bundle --platform=node                                  │
│                  api/boot.ts            ──► dist/boot.js        (server bundle)    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── start   (production runtime) ──────────────────────────────┐
│                                                                                    │
│   NODE_ENV=production   node dist/boot.js                                          │
│        │                                                                           │
│        ▼                                                                           │
│   Hono listens on $PORT (3000) and:                                                │
│        ├──► serves dist/public/* as static                                         │
│        ├──► handles /api/oauth/*                                                   │
│        └──► handles /api/trpc/*                                                    │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

The reason `build` produces *two* artifacts (SPA bundle in `dist/public/`
and server bundle in `dist/boot.js`) and `start` reads only `boot.js` is
that the Hono process is the one serving the SPA at runtime. The static
files are inside the Docker image alongside the JS bundle.

## 18. The Dockerfile, stage by stage

Multi-stage build, four stages. The final image only carries the production
dependencies and the compiled output — no source, no dev tools, no
`.git`.

```
                 ┌──────────────────────────────────────┐
                 │  Stage 1:  base                      │
                 │  FROM node:20-alpine                 │
                 │  WORKDIR /app                        │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  Stage 2:  deps                      │
                 │  COPY package*.json                  │
                 │  RUN --mount=type=cache  npm ci      │
                 │      (cache mount keeps npm cache    │
                 │       warm between CI builds)        │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  Stage 3:  build                     │
                 │  COPY . .                            │
                 │  RUN npm run build                   │
                 │      ─► dist/public/                 │
                 │      ─► dist/boot.js                 │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │  Stage 4:  production                │
                 │  FROM node:20-alpine                 │
                 │  COPY --from=deps  node_modules      │
                 │  COPY --from=build dist              │
                 │  COPY package.json                   │
                 │  ENV NODE_ENV=production  PORT=3000  │
                 │  EXPOSE 3000                         │
                 │  CMD ["npm", "start"]                │
                 └──────────────────────────────────────┘
```

Why the deps and build stages are separated: `npm ci` is the slow step, so
Docker layer-caches it independently of source changes. Edit a React
component and `Stage 2: deps` is reused instantly; only `Stage 3: build`
re-runs.

## 19. The Jenkins → GCP pipeline

What happens between `git push origin main` and a fresh container answering
`curl https://xaiht.org/`. Five Jenkins stages, one VM, one image registry.

```
   Developer                Jenkins                Artifact Registry      GCP VM
       │                       │                        │                   │
       │ git push main         │                        │                   │
       ├──────────────────────►│                        │                   │
       │                       │                        │                   │
       │                       │ 1. checkout main       │                   │
       │                       │    capture SHORT_SHA   │                   │
       │                       │                        │                   │
       │                       │ 2. docker build        │                   │
       │                       │    ─ multi-stage       │                   │
       │                       │    ─ tag :SHA :latest  │                   │
       │                       │                        │                   │
       │                       │ 3. docker push         │                   │
       │                       ├───────────────────────►│                   │
       │                       │                        │                   │
       │                       │ 4. ssh  jenkins-deployer@VM                │
       │                       │    sudo systemctl restart xaiht-app        │
       │                       ├───────────────────────────────────────────►│
       │                       │                        │                   │
       │                       │                        │     docker pull   │
       │                       │                        │◄──────────────────┤
       │                       │                        │                   │
       │                       │                        │ container starts  │
       │                       │                        │ node dist/boot.js │
       │                       │                        │                   │
       │                       │ 5. poll  systemctl is-active   (≤ 3 min)   │
       │                       │◄───────────────────────────────────────────┤
       │                       │                                            │
       │                       │ 6. smoke test                              │
       │                       │    curl https://xaiht.org/                 │
       │                       │    expect 200 / 302 / 304                  │
       │                       │◄───────────────────────────────────────────┤
       │                       │                        │                   │
       │   ✅ PASS              │                        │                   │
       │◄──────────────────────┤                        │                   │
       ▼                       ▼                        ▼                   ▼
```

The deploy is *restart-based*: every push results in a `:latest` tag on
the Artifact Registry side, and `systemctl restart xaiht-app` is what
pulls and switches the running container on the VM. No rolling updates,
no zero-downtime gymnastics — a brief blip during restart is the trade-off
for operational simplicity (see `project_xaiht_jenkins_cicd.md`).

## 20. Runtime configuration

Every environment variable the running server cares about, where it's read,
and where it's used. One file (`api/lib/env.ts`) is the single point of
ingestion; everywhere else reads from that module, not from `process.env`
directly.

```
                ┌──────────────────────────────────────────────┐
                │  Environment  (systemd unit / docker -e)     │
                │                                              │
                │  NODE_ENV=production                         │
                │  PORT=3000                                   │
                │  APP_SECRET=<32-byte random, stable>         │
                │  DATABASE_URL=mysql://…                      │
                │  GOOGLE_CLIENT_ID=…                          │
                │  GOOGLE_CLIENT_SECRET=…                      │
                │  PUBLIC_BASE_URL=https://xaiht.org   (opt.)  │
                │  OWNER_GOOGLE_SUB=…                  (opt.)  │
                └────────────────────────┬─────────────────────┘
                                         │  read at boot
                                         ▼
                ┌──────────────────────────────────────────────┐
                │  api/lib/env.ts                              │
                │                                              │
                │  single source of truth                      │
                │   ─ throws in production if required is      │
                │     missing                                  │
                │   ─ defaults to "" in dev (lenient)          │
                │   ─ exposes typed const "env"                │
                └────┬──────────┬──────────┬──────────┬────────┘
                     │          │          │          │
                     ▼          ▼          ▼          ▼
              ┌──────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐
              │ kimi/    │ │ kimi/   │ │ queries│ │ boot.ts │
              │ session  │ │ auth    │ │ /conn- │ │         │
              │ .ts      │ │ .ts     │ │ ection │ │         │
              │          │ │         │ │ .ts    │ │         │
              │APP_SECRET│ │GOOGLE_* │ │DATABASE│ │ PORT    │
              │          │ │PUBLIC_  │ │_URL    │ │         │
              │          │ │BASE_URL │ │        │ │         │
              └──────────┘ └─────────┘ └────────┘ └─────────┘
```

The lenient-in-dev behavior is what lets a brand-new contributor run
`npm run dev` with no `.env` at all — most pages still render, the OAuth
flow is the only thing that hard-fails. In production, missing required
vars are caught at process start, before the server begins accepting
traffic.

---

# Part IX — Reference cards

## 21. Tech stack at a glance

A printable cheat sheet of every library and platform piece that makes up
this stack. Use it when you're explaining the project to someone new, or
when you need to remember "wait, are we on tRPC v10 or v11?"

```
┌────────────────────────────── Frontend ───────────────────────────────┐
│  React 19         React Router 7      TypeScript 5.9      Vite 7      │
│  tRPC client 11   React Query 5       superjson                       │
│  Radix UI primitives + shadcn/ui      Tailwind CSS 3                  │
│  GSAP + ScrollTrigger    D3 (graph view)    Zod (validation)          │
└───────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Backend ────────────────────────────────┐
│  Hono 4    Node 20    tRPC server 11    Drizzle ORM 0.45              │
│  mysql2    jose (HS256 JWT)             cookie    superjson           │
└───────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Data ───────────────────────────────────┐
│  MySQL  (PlanetScale serverless driver mode)                          │
│  Drizzle Kit migrations  (db:generate / db:migrate / db:push)         │
└───────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Build & deploy ─────────────────────────┐
│  Vite (SPA)             esbuild (server bundle)                       │
│  Docker multi-stage     GCP Artifact Registry                         │
│  GCP Compute Engine VM + systemd (xaiht-app.service)                  │
│  Jenkins (Jenkinsfile)  Cloudflare DNS + TLS  (xaiht.org)             │
└───────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Auth ───────────────────────────────────┐
│  Google OAuth 2.0       HS256 JWT in cookie  kimi_sid                 │
│  HttpOnly · Lax · Secure (except on localhost) · 1 year max-age       │
└───────────────────────────────────────────────────────────────────────┘
```

## 22. One-page mental model

The whole system in one diagram. If you only remember one picture from this
document, remember this one — every other diagram in the book is a zoom-in
on one of these arrows.

```
   ┌────────────────────────────── BROWSER ──────────────────────────────┐
   │                                                                     │
   │  React SPA  (Vite bundle)                                           │
   │   ─ pages drawn from contracts-typed components                     │
   │   ─ tRPC client + React Query talks to /api/trpc                    │
   │   ─ browser navigation to /api/oauth/* for sign-in                  │
   │                                                                     │
   └─────────────────────────────────┬───────────────────────────────────┘
                                     │  HTTPS   (cookie kimi_sid)
                                     ▼
   ┌─────────────────────── SINGLE NODE PROCESS ─────────────────────────┐
   │                                                                     │
   │  Hono   (api/boot.ts)                                               │
   │     ├─ static SPA from dist/public                                  │
   │     ├─ /api/oauth/start   |   /api/oauth/callback                   │
   │     └─ /api/trpc/*   ◄──   appRouter  { ping, auth, notes }         │
   │                                │                                    │
   │                                ▼                                    │
   │   createContext  →  middleware  →  procedure  →  Drizzle            │
   │                                                                     │
   └─────────────────┬────────────────────────────┬──────────────────────┘
                     │                            │
                     ▼                            ▼
   ┌─────────────────────────────────┐  ┌────────────────────────────────┐
   │  MySQL  (PlanetScale)           │  │  Google OAuth 2.0              │
   │  users  ·  notes                │  │  identity provider             │
   └─────────────────────────────────┘  └────────────────────────────────┘

                                ─ ─ ─ ─

   Compile-time link (no runtime cost):
      contracts/types.ts   ←   imported by both SPA and Hono.
   This is what gives the whole stack its end-to-end TypeScript safety.
```

---

## Closing note

There is no PDF or PPTX in this directory because there does not need to
be — every diagram above is plain text in a fenced code block, which means:

- It will paste **as-is** into a PowerPoint text box (use Consolas or
  Cascadia Code at 12–14pt, and the alignment will hold).
- It will render in any Markdown viewer (GitHub, VS Code, Obsidian, Typora,
  the GitHub Mobile app, …) without a single extra dependency.
- It will display correctly over SSH, in a `less` pager, in a code review
  comment, or pasted into a chat.

If a glyph ever looks wrong on your screen, the culprit is almost always
a non-monospace font or a tab-vs-space mismatch. Switch the renderer to a
monospace font and the boxes will snap back into shape.

Now you can read the codebase the way you'd read a map — go to whichever
diagram answers the question you have, then follow its arrows back into
the source.

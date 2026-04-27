# xaiht.org — Developer README

A fullstack personal-knowledge / notes web app deployed at **https://xaiht.org**.
Wiki-style `[[links]]`, Markdown notes, a D3 force-directed knowledge graph, a real-time
moon-phase widget, and four GPU/canvas backgrounds. Per-user persistence in MySQL,
sign-in via Google OAuth 2.0, sessions via signed JWT cookie.

This README is intended as the **single ground-truth onboarding document**: read top to bottom
and you can build, run, debug, deploy, and operate the site without consulting anything else.

---

## 1. TL;DR

```bash
# Local dev (after creating .env — see §4)
npm install
npm run dev          # Vite + Hono (one process, port 3000)

# Production build
npm run build        # builds frontend (Vite) and bundles server (esbuild)
npm start            # runs dist/boot.js with NODE_ENV=production

# Database
npm run db:push      # apply db/schema.ts to the DB pointed to by DATABASE_URL
```

App runs at http://localhost:3000. The Vite dev server **also** serves the API
via `@hono/vite-dev-server` — there is no second port.

---

## 2. What this app actually is

Originally a *9 Moon Note* template (Chinese-language Kimi-OAuth notes app). It was forked
into the xaiht.org production deployment with these material changes:

| Concern         | Template default                               | This repo                                                                                  |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Auth provider   | Kimi (Moonshot) OAuth                          | **Google OAuth 2.0** (Kimi was unreachable from outside CN)                                |
| OAuth code dir  | `api/kimi/`                                    | Same dir name (`api/kimi/`) — kept to minimize diff churn; contents are now Google-flavor  |
| Session cookie  | `SameSite=None` in prod                        | **`SameSite=Lax`** (Chrome drops `None` cookies even on first-party requests now)          |
| `Login.tsx`     | Tried to destructure non-existent `getOAuthUrl`| Plain `<a href={Paths.oauthStart}>`                                                        |
| `useAuth.ts`    | Let stale React Query cache linger on errors   | Clears `user → null` on `auth.me` error                                                    |
| Hosting         | none specified                                 | GCP Compute Engine VM (`xaiht-vm`) + Cloud SQL (MySQL 8) + Cloudflare DNS + Let's Encrypt  |

The `users.unionId` column **stores the Google `sub`** despite the legacy column name — see
[`db/schema.ts`](db/schema.ts) and [`api/lib/env.ts`](api/lib/env.ts).

---

## 3. Architecture at a glance

### 3.1 Process model

One Node process. Hono serves both the API and (in production) the static React build:

```
                   ┌───────────────── single Node process ─────────────────┐
                   │                                                       │
Browser ─HTTPS──▶  │  Hono app  ──▶  /api/oauth/start    (Google redirect) │
                   │            ──▶  /api/oauth/callback (token exchange)  │
                   │            ──▶  /api/trpc/*         (tRPC over fetch) │
                   │            ──▶  /*  static files from dist/public     │
                   └───────────────────────────────────────────────────────┘
```

In **dev**, Vite hosts the React app and `@hono/vite-dev-server` mounts the same Hono app for
`/api/*`. In **production**, `npm run build` produces:
- `dist/public/` — the built React SPA
- `dist/boot.js` — the bundled server (esbuild, ESM)

`npm start` runs `dist/boot.js`, which calls `serveStaticFiles(app)` to serve `dist/public/`.

### 3.2 Code layout

```
api/                         tRPC + Hono server
  boot.ts                    Hono app entry, wires OAuth routes + tRPC
  router.ts                  Root tRPC router (auth, notes, ping)
  context.ts                 Per-request context (parses session, attaches user)
  middleware.ts              tRPC procedures: publicQuery, authedQuery, adminQuery
  auth-router.ts             auth.me + auth.logout
  notes-router.ts            notes CRUD + STARTER_NOTES seeding (server-side)
  kimi/                      OAuth code (folder name is legacy; provider is Google)
    auth.ts                  createOAuthStartHandler / createOAuthCallbackHandler
    platform.ts              fetchGoogleUserInfo (oauth2/v3/userinfo)
    session.ts               sign/verify HS256 session JWT (jose)
    types.ts                 Google profile + token-response types
  lib/
    env.ts                   Process env loader (dotenv) + required() guard
    cookies.ts               Session cookie options — SameSite=Lax, hard-coded; do not change
    http.ts                  Small fetch helpers
    vite.ts                  Production static-file serving
  queries/
    connection.ts            mysql2 pool + drizzle client
    users.ts                 findUserByUnionId / upsertUser

contracts/                   Code shared between server and client
  constants.ts               Session.cookieName, Paths (oauthStart, oauthCallback), ErrorMessages
  errors.ts                  Errors.forbidden() etc.
  types.ts                   Shared shapes

db/
  schema.ts                  Drizzle schema (users, notes)
  relations.ts               Drizzle relations
  seed.ts                    Manual per-user starter-notes seeder
  migrations/                Empty in this branch — schema currently applied via `db:push`

src/                         React 19 SPA
  App.tsx                    Routes: /, /tlamatini, /login, *
  main.tsx                   React entry
  config.ts                  ALL UI strings + client-side starterNotes (must mirror server STARTER_NOTES)
  pages/                     Home, Tlamatini, Login, NotFound
  components/                AsciiIntro, AuthLayout, Sidebar, NoteEditor, GraphView,
                             MoonPhase, MoonlitRipple, FlowField, RainOnGlass, Footer, Navigation, ui/
  hooks/                     useAuth, useNotes, use-mobile
  providers/                 React Query + tRPC provider tree
  store.ts                   Client-side state (Zustand-like)
  lib/                       Utilities + tRPC client wiring

scripts/
  build-server.mjs           esbuild production server bundler
  vm-setup.sh                One-shot VM bootstrap (docker, cloud-sql-proxy, systemd units)
  vm-nginx-https.sh          Install nginx + certbot for xaiht.org / www.xaiht.org
  vm-update-env.sh           Push a fresh /etc/xaiht/app.env to the VM
  vm-rotate-secret.sh        Rotate APP_SECRET (logs everyone out)
  vm-drizzle-push.sh         Run drizzle-kit push from inside the app image, --network host

Dockerfile                   Multi-stage: deps → build → production (node:20-alpine, EXPOSE 3000)
drizzle.config.ts            mysql dialect, schema → db/schema.ts
vite.config.ts               Aliases @, @contracts, @db; mounts Hono dev server
tsconfig.{json,app,node,server}.json
.backend-features.json       Declares ["auth", "db"] for backend-building
.env.example                 Documents every required env var
```

### 3.3 Path aliases

Defined in [`vite.config.ts`](vite.config.ts) and the tsconfigs:

| Alias         | Resolves to       |
| ------------- | ----------------- |
| `@/...`       | `./src/...`       |
| `@contracts`  | `./contracts/...` |
| `@db` / `db`  | `./db/...`        |

Use the alias, not relative paths, for anything crossing top-level boundaries.

---

## 4. Environment variables

Copy `.env.example` → `.env`. The runtime guard in [`api/lib/env.ts`](api/lib/env.ts) only
**throws** when `NODE_ENV=production` — so a missing var in dev silently becomes the empty
string. If something behaves weirdly in dev, double-check `.env` first.

| Var                    | Required          | What it does                                                                      |
| ---------------------- | ----------------- | --------------------------------------------------------------------------------- |
| `NODE_ENV`             | yes               | `development` or `production`. Drives env guard + cookie `secure` flag.           |
| `PORT`                 | no (default 3000) | Hono listen port in production.                                                   |
| `APP_SECRET`           | yes               | HS256 signing key for the session JWT. **64-char hex** recommended.               |
| `DATABASE_URL`         | yes               | `mysql://user:pass@host:port/db`. Local dev: a local MySQL or `cloud-sql-proxy`.  |
| `GOOGLE_CLIENT_ID`     | yes               | OAuth Web client from GCP Console → APIs & Services → Credentials.                |
| `GOOGLE_CLIENT_SECRET` | yes               | Same place. Server-side only — never ship to the client.                          |
| `PUBLIC_BASE_URL`      | recommended       | Public origin used to build `redirect_uri`. Must byte-equal the GCP-registered URI.|
| `OWNER_GOOGLE_SUB`     | optional          | Google `sub` of the account to auto-promote to `role=admin` on sign-in.           |

Production values live on the VM at `/etc/xaiht/app.env` (chmod 600, owner root). Read with
`sudo cat`. Don't ask the user — SSH and read it.

> **Dead config left over from the template** — `VITE_KIMI_AUTH_URL` and `VITE_APP_ID` in old
> `.env.example` copies. They are **never referenced in `src/`**. Don't waste time setting them.

---

## 5. Authentication flow

### 5.1 Sequence

```
[1] Browser ─▶ GET /login                                   (rendered by src/pages/Login.tsx)
[2]   user clicks "Sign in with Google"
[3] Browser ─▶ GET /api/oauth/start
                  └─ createOAuthStartHandler builds:
                       redirect_uri = PUBLIC_BASE_URL + /api/oauth/callback
                       state        = base64(redirect_uri)
                  └─ 302 → https://accounts.google.com/o/oauth2/v2/auth?...
[4] Browser ─▶ Google consent screen
[5] Google ─▶ 302 → ${redirect_uri}?code=...&state=...
[6] Browser ─▶ GET /api/oauth/callback?code=...&state=...
                  └─ exchangeAuthCode(code) at oauth2.googleapis.com/token
                  └─ fetchGoogleUserInfo(access_token) at oauth2/v3/userinfo
                  └─ upsertUser({ unionId: profile.sub, name, email, avatar, lastSignInAt })
                  └─ signSessionToken({ unionId, clientId })  (HS256, signed by APP_SECRET)
                  └─ Set-Cookie: kimi_sid=<jwt>; HttpOnly; SameSite=Lax; Secure (in prod)
                  └─ 302 → /
[7] Browser ─▶ tRPC auth.me  (uses cookie)
                  └─ context.ts parses cookie → authenticateRequest → ctx.user
                  └─ returns user row
```

Key files:

- [`api/kimi/auth.ts`](api/kimi/auth.ts) — handlers + token exchange
- [`api/kimi/session.ts`](api/kimi/session.ts) — `signSessionToken` / `verifySessionToken`
- [`api/lib/cookies.ts`](api/lib/cookies.ts) — `getSessionCookieOptions` (returns `sameSite: "Lax"`)
- [`contracts/constants.ts`](contracts/constants.ts) — `Session.cookieName = "kimi_sid"`, `Paths.oauthStart`, `Paths.oauthCallback`
- [`api/auth-router.ts`](api/auth-router.ts) — `auth.me`, `auth.logout`
- [`src/hooks/useAuth.ts`](src/hooks/useAuth.ts) — clears user on `auth.me` error
- [`src/pages/Login.tsx`](src/pages/Login.tsx) — `<a href={Paths.oauthStart}>`

### 5.2 Non-obvious decisions you must respect

1. **Cookie `SameSite` is `Lax`, never `None`.** Chrome's tracking protection now drops
   `SameSite=None` cookies aggressively even on first-party requests, which causes a silent
   401 spiral after login. `Lax` is correct because the OAuth callback is a top-level
   navigation. `getSessionCookieOptions` hard-codes this. Don't "fix" it.
2. **`useAuth` clears user to `null` on `auth.me` error.** Otherwise React Query's stale cache
   keeps the old name in the navbar after the cookie is dropped.
3. **`Login.tsx` was broken upstream** — the template destructured a non-existent
   `getOAuthUrl` from `useAuth`, causing a blank-page crash. We use `<a href>` directly.
4. **OAuth folder is named `kimi/`** for legacy reasons; the provider is now Google. There's a
   header comment on every file inside. Don't rename — diff churn isn't worth it.
5. **`users.unionId`** stores the Google `sub`, despite the column name. The `OWNER_GOOGLE_SUB`
   env var matches against this column. There's a comment at `api/lib/env.ts:29` calling this out.

### 5.3 OAuth client config (GCP)

GCP project `xaiht-492820`, client name `xaiht-web`:

- Client ID: `943833223387-6hptd0jt40geo0f1haekj8q0r9bjfm6o.apps.googleusercontent.com`
- Authorized redirect URIs:
  - `https://xaiht.org/api/oauth/callback`
  - `https://www.xaiht.org/api/oauth/callback`
  - (add `http://localhost:3000/api/oauth/callback` if you want local dev to hit Google)
- App publishing status: **Testing** — only test users can sign in until "Publish App" is
  clicked on the consent screen. Add additional Google accounts under the testing-users list.

---

## 6. Database

### 6.1 Schema ([db/schema.ts](db/schema.ts))

```ts
users  ─ id (serial PK), unionId (unique varchar 255), name, email, avatar (text),
         role enum('user','admin') default 'user', createdAt, updatedAt, lastSignInAt
notes  ─ id (serial PK), userId (bigint unsigned ref users.id), title, content (text),
         tags json (string[]), source (text), createdAt, updatedAt
```

### 6.2 Workflow

- **Edit `db/schema.ts`** → run `npm run db:push` against your local MySQL (or, in prod, the
  `vm-drizzle-push.sh` flow described in §8.5).
- **Generate migrations** with `npm run db:generate` if you prefer migration files. The current
  prod DB was bootstrapped with `db:push` directly; `db/migrations/` is empty.
- **Manual seed for one user**: `npx tsx db/seed.ts <userId>` — useful when starter notes
  didn't auto-seed for some reason.

### 6.3 Auto-seeding starter notes

`notesRouter.list` checks the user's note count; if zero, it inserts the server-side
`STARTER_NOTES` array from the top of [`api/notes-router.ts`](api/notes-router.ts).

Unauthenticated visitors see the **client-side** `starterNotes` array from
[`src/config.ts`](src/config.ts), persisted to `localStorage` under
`storageConfig.notesKey`.

> **Keep both arrays in sync.** If a user signs in and the server-side notes differ from what
> they saw before, the experience feels broken. The two arrays should match in title, content,
> and tags.

### 6.4 Production database

- Cloud SQL instance `xaiht-db`, MySQL 8, tier `db-f1-micro`
- Connection name: `xaiht-492820:us-central1:xaiht-db`
- Database: `xaiht`, app user: `xaiht-app`
- Reached from the VM via **`cloud-sql-proxy` listening on `127.0.0.1:3306`** — the app's
  `DATABASE_URL` therefore looks like `mysql://xaiht-app:<pw>@127.0.0.1:3306/xaiht`.

---

## 7. Frontend content (CRITICAL for non-trivial edits)

All UI strings live in [`src/config.ts`](src/config.ts). **Do not hard-code strings into
components.** Sections you'll touch most often:

- `siteConfig` — title, description, BCP-47 language tag
- `headerConfig` — brand mark, view labels, button labels (≤ ~6–10 chars)
- `backgroundConfig` — must keep all 4 ids: `moonlit | silk | rain | solid`. Renaming an id
  detaches it from the actual WebGL/Canvas component.
- `sidebarConfig`, `editorConfig`, `graphConfig`, `moonConfig`, `appConfig` — every other label
- `storageConfig.notesKey` — localStorage key prefix for the unauthenticated fallback store
- `starterNotes` — 6–12 entries; each note should reference others via `[[Title]]`

`moonConfig.phaseLabels` must be **exactly 8 strings** in order:
`[New, Waxing Crescent, First Quarter, Waxing Gibbous, Full, Waning Gibbous, Last Quarter, Waning Crescent]`.

Wiki-link resolution is **case-insensitive but whitespace-sensitive** — match titles exactly.

---

## 8. Production deployment (GCP Compute Engine)

Live at https://xaiht.org. Stack on the VM:

```
Internet → :443 nginx (TLS via Let's Encrypt) → :3000 docker xaiht-app (--network host)
                                                       ↓ DATABASE_URL=mysql://...@127.0.0.1:3306/xaiht
                                                  127.0.0.1:3306 cloud-sql-proxy → Cloud SQL
```

### 8.1 Resources (project `xaiht-492820`, region `us-central1`)

| Resource              | Identifier                                                           |
| --------------------- | -------------------------------------------------------------------- |
| VM                    | `xaiht-vm`, e2-small, Debian 12, zone `us-central1-a`                |
| Static IP             | `136.116.194.179` (resource: `xaiht-ip`)                             |
| Network tags          | `http-server`, `https-server`                                        |
| Cloud SQL             | `xaiht-db`, MySQL 8, tier `db-f1-micro`                              |
| Artifact Registry     | `us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app:latest` |
| Default Compute SA    | `943833223387-compute@developer.gserviceaccount.com`                 |
| SA roles granted      | `cloudsql.client`, `artifactregistry.reader`                         |

### 8.2 On-VM file locations

```
/etc/xaiht/app.env                          chmod 600 — runtime env vars
/etc/systemd/system/cloud-sql-proxy.service Restart=always, listens 127.0.0.1:3306
/etc/systemd/system/xaiht-app.service       Restart=always, ExecStartPre pulls :latest
/etc/nginx/sites-enabled/xaiht.conf         certbot-managed TLS termination
/etc/letsencrypt/live/xaiht.org/{fullchain,privkey}.pem  auto-renewed by certbot.timer
~/vm-setup.sh, vm-nginx-https.sh,
~/vm-update-env.sh, vm-rotate-secret.sh,
~/drizzle-work/                             preserved install + admin scripts
```

`/etc/xaiht/app.env` schema:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://xaiht-app:<password>@127.0.0.1:3306/xaiht
APP_SECRET=<64-char hex>
GOOGLE_CLIENT_ID=943833223387-6hptd0jt40geo0f1haekj8q0r9bjfm6o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<from GCP Console>
PUBLIC_BASE_URL=https://xaiht.org
OWNER_GOOGLE_SUB=112449149955719452362   # Ángela López — auto-admin
```

### 8.3 DNS (Cloudflare)

Domain registered via Cloudflare Registrar. Authoritative nameservers `hank.ns.cloudflare.com`
+ `tori.ns.cloudflare.com`. `A` records for `@` and `www` → `136.116.194.179`. Cloudflare
**proxy is OFF (gray cloud)** so Let's Encrypt HTTP-01 works on renew.

### 8.4 Deploy a new version

From a local shell with `gcloud` + `docker` available (PowerShell on Windows works):

```powershell
docker build -t us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app:latest .

$token = (gcloud auth print-access-token).Trim()
docker login -u oauth2accesstoken -p $token https://us-central1-docker.pkg.dev

docker push us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app:latest

gcloud compute ssh xaiht-vm --zone=us-central1-a `
  --command="sudo systemctl restart xaiht-app"
```

`xaiht-app.service` has `ExecStartPre=docker pull` so `restart` picks up `:latest`. The first
`restart` may report "timed out" because the pull is slow — systemd auto-retries. Confirm
with `sudo systemctl status xaiht-app` and `sudo journalctl -u xaiht-app -n 200 --no-pager`.

### 8.5 Run a schema migration in production

If you change `db/schema.ts`:

```powershell
gcloud compute scp drizzle.config.ts db scripts/vm-drizzle-push.sh `
  xaiht-vm:drizzle-work/ --recurse --zone=us-central1-a

gcloud compute ssh xaiht-vm --zone=us-central1-a `
  --command="bash ~/drizzle-work/vm-drizzle-push.sh"
```

`vm-drizzle-push.sh` runs the production app image with `--network host` so it can reach the
cloud-sql-proxy at `127.0.0.1:3306`. The image already bundles `drizzle-kit` in
`node_modules`.

### 8.6 Rotate the session secret

```powershell
gcloud compute ssh xaiht-vm --zone=us-central1-a --command="bash ~/vm-rotate-secret.sh"
```

Generates a new 64-char hex `APP_SECRET`, writes it to `/etc/xaiht/app.env`, and restarts the
app. **Every existing session is invalidated** — all users will need to sign in again.

### 8.7 Update env without redeploying

Edit `~/vm-update-env.sh` locally if needed, then:

```powershell
gcloud compute scp scripts/vm-update-env.sh xaiht-vm: --zone=us-central1-a
gcloud compute ssh xaiht-vm --zone=us-central1-a --command="bash ~/vm-update-env.sh"
```

Always restart the app afterwards (`sudo systemctl restart xaiht-app`).

---

## 9. Local development walkthrough

### 9.1 Prerequisites

- Node 20.x (matches the Docker base image; Vite 7 needs ≥ 18)
- A local MySQL 8 server (or run `cloud-sql-proxy` against the prod DB if you must — but
  prefer a local DB to avoid clobbering prod data)
- `gcloud` CLI **only** if you plan to deploy

### 9.2 Bootstrap a local MySQL

```bash
# Any MySQL 8. Example with docker:
docker run -d --name xaiht-mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=pass \
  -e MYSQL_DATABASE=xaiht \
  mysql:8

# .env
DATABASE_URL=mysql://root:pass@127.0.0.1:3306/xaiht
APP_SECRET=$(openssl rand -hex 32)        # any stable random hex
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
PUBLIC_BASE_URL=http://localhost:3000
```

Apply schema:

```bash
npm run db:push
```

### 9.3 Run

```bash
npm run dev
```

Visit `http://localhost:3000`. The Google OAuth flow needs
`http://localhost:3000/api/oauth/callback` registered as an authorized redirect URI on the
GCP OAuth client. Add yourself as a test user in the OAuth consent screen.

### 9.4 Useful scripts

| Script             | What it does                                                     |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Vite + Hono dev server on port 3000                              |
| `npm run build`    | `vite build` (frontend) → `node scripts/build-server.mjs` (esbuild) |
| `npm start`        | `node dist/boot.js` with `NODE_ENV=production`                   |
| `npm run check`    | `tsc -b` — type-checks all tsconfig projects                     |
| `npm run lint`     | ESLint                                                           |
| `npm run format`   | Prettier write                                                   |
| `npm run test`     | Vitest                                                           |
| `npm run db:generate` | drizzle-kit generate (writes a migration file)                |
| `npm run db:migrate`  | drizzle-kit migrate (applies migrations)                      |
| `npm run db:push`     | drizzle-kit push (apply schema directly, no migration files)  |

---

## 10. Tech stack reference

| Layer            | Tech                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| Frontend         | React 19, TypeScript 5.9, Vite 7, React Router v7                                     |
| UI               | Tailwind CSS v3, shadcn/ui (Radix primitives), `lucide-react`, `next-themes`, `sonner`|
| Animations       | GSAP, custom WebGL shaders + Canvas 2D, D3 force layout                               |
| Backend          | Hono 4, `@hono/node-server`, tRPC 11, superjson                                       |
| DB               | MySQL 8 + Drizzle ORM (`drizzle-orm`, `drizzle-kit`), `mysql2` driver                 |
| Auth             | Google OAuth 2.0 (server flow), `jose` for HS256 session JWT, `cookie` for parsing    |
| Tooling          | esbuild (server bundle), eslint 9 + typescript-eslint, prettier, vitest 4             |
| Misc             | `react-markdown` + `remark-gfm`, `nanoid`, `date-fns`, `zod`                          |

---

## 11. Design conventions (don't break these)

- **Liquid-glass UI**: floating panels use `backdrop-filter: blur(...)` over a semi-transparent
  background. Even if asked for a "flat" design, keep the blur — it's the signature look. Tone
  down the palette instead.
- **Procedural backgrounds**: all 4 modes (`moonlit`, `silk`, `rain`, `solid`) are GPU/canvas.
  They are load-bearing — don't replace them with static images.
- **Color palette**: `#e0e0e0` foreground on black, accent `#c8956c`, wiki-link `#d4a574`.
- **No binary assets** ship with the template. If a feature genuinely needs an image, drop it
  in `public/images/`.

---

## 12. Common pitfalls (keep these in muscle memory)

### Windows / `gcloud` / Docker

- `gcloud` not on PATH after install in already-open shells. Prepend in the same command:
  `$env:Path += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"`.
- `gcloud auth configure-docker` writes a `credHelpers` block that points to
  `docker-credential-gcloud`, **which is not on Windows PATH**. Symptom:
  `docker push` fails with `executable file not found`. Fix: remove the `credHelpers` block
  from `~/.docker/config.json`, then
  `docker login -u oauth2accesstoken -p $(gcloud auth print-access-token) https://us-central1-docker.pkg.dev`.
- PowerShell turns `--tags=foo,bar` into a single token. Add tags one at a time
  (`gcloud compute instances add-tags ... --tags=foo`) or quote.
- For multi-line scripts on the VM, **always** write a `.sh` locally → `gcloud compute scp` →
  `gcloud compute ssh ... --command="bash ~/script.sh"`. Inline `--command` with PowerShell
  quoting is a recurring pain.
- `gcloud compute scp foo xaiht-vm:~/file` errors with "remote filespec ~ is not a directory".
  Drop the `~/`; relative paths land in `$HOME` anyway.

### App-level

- A 401 immediately after a successful login almost always means **`SameSite=None` snuck back
  into `cookies.ts`**. Verify it says `Lax`.
- A blank `/login` page means `getOAuthUrl` was reintroduced somewhere. The fix is a plain
  `<a href={Paths.oauthStart}>`.
- Stale username in the navbar after logout → `useAuth` is letting React Query keep the cache.
  It must clear `user → null` when `auth.me` errors.
- `db:push` failing with "ER_NOT_SUPPORTED_AUTH_MODE" → MySQL 8 default auth plugin issue.
  `mysql2` already includes `caching_sha2_password` support — make sure you're on 3.14+.

---

## 13. Worktrees & this `.claude/` directory

This repository is occasionally checked out into git worktrees under
`.claude/worktrees/<name>/` for parallel agent sessions. A worktree shares `.git/` with the
main repo but has its **own** `node_modules/`. If you `cd` into a worktree and the build
fails because deps are missing, run `npm install` in that worktree directly.

The main checkout lives at `C:\Development\XAIHT\web-app` on the developer's machine.

---

## 14. External links

- App: https://xaiht.org
- GCP Console: https://console.cloud.google.com/?project=xaiht-492820
  - VMs: https://console.cloud.google.com/compute/instances?project=xaiht-492820
  - Cloud SQL: https://console.cloud.google.com/sql/instances?project=xaiht-492820
  - Artifact Registry: https://console.cloud.google.com/artifacts?project=xaiht-492820
  - Logs: https://console.cloud.google.com/logs/query?project=xaiht-492820
- DNS: Cloudflare dashboard, `xaiht.org` zone — https://dash.cloudflare.com
- TLS: Let's Encrypt, on-VM at `/etc/letsencrypt/live/xaiht.org/`
- Origin template: 9 Moon Note (`info.md` in this repo describes the template-author's intent)

---

## 15. License

See [LICENSE](LICENSE).

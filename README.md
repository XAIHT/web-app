<p align="center">
  <img src="public/images/hero-xaiht.jpg" alt="XAIHT" width="220" />
</p>

<h1 align="center">XAIHT · xaiht.org</h1>

<h3 align="center">The web home of <em>Tlamatini</em>.</h3>

<p align="center">
  <em>"One who knows" — in Nahuatl.</em><br/>
  The official marketing &amp; documentation website for <strong>Tlamatini</strong>, the local-first AI developer assistant — a React&nbsp;19 single-page app with a Hono&nbsp;+&nbsp;tRPC backend, served from a Google Cloud VM at <strong>xaiht.org</strong>.
</p>

<p align="center">
  <a href="https://xaiht.org"><strong>🌐 Live site</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/XAIHT/Tlamatini"><strong>📦 The Tlamatini app</strong></a> &nbsp;·&nbsp;
  <a href="#-quickstart-local-dev-in-5-minutes"><strong>⚡ Quickstart</strong></a> &nbsp;·&nbsp;
  <a href="#7-build--deploy"><strong>🚀 Deploy</strong></a>
</p>

---

### 🌟 What is this repo?

> This is **not** the Tlamatini desktop application — that lives at [github.com/XAIHT/Tlamatini](https://github.com/XAIHT/Tlamatini).
>
> This repo is the **public-facing website** that tells the world what Tlamatini is, shows the demos, and walks visitors through installation. It is a fully-fledged fullstack app in its own right: a React front end, a typed RPC backend, Google sign-in, a MySQL database, and a one-command Docker deploy to Google Cloud.

---

<p align="center">
  <a href="https://xaiht.org"><img src="https://img.shields.io/badge/LIVE-xaiht.org-1E90FF?style=for-the-badge&labelColor=2D2D2D" alt="xaiht.org" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&labelColor=2D2D2D&logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TYPESCRIPT-5.9-3178C6?style=for-the-badge&labelColor=2D2D2D&logo=typescript&logoColor=white" alt="TypeScript 5.9" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/VITE-7-646CFF?style=for-the-badge&labelColor=2D2D2D&logo=vite&logoColor=white" alt="Vite 7" /></a>
  <a href="https://trpc.io/"><img src="https://img.shields.io/badge/tRPC-11-398CCB?style=for-the-badge&labelColor=2D2D2D&logo=trpc&logoColor=white" alt="tRPC 11" /></a>
  <a href="https://hono.dev/"><img src="https://img.shields.io/badge/HONO-4-E36002?style=for-the-badge&labelColor=2D2D2D&logo=hono&logoColor=white" alt="Hono 4" /></a>
  <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/DRIZZLE-MYSQL-4479A1?style=for-the-badge&labelColor=2D2D2D&logo=mysql&logoColor=white" alt="Drizzle + MySQL" /></a>
  <a href="#73-gcp-infrastructure"><img src="https://img.shields.io/badge/RUNS%20ON-GCP%20COMPUTE-4285F4?style=for-the-badge&labelColor=2D2D2D&logo=googlecloud&logoColor=white" alt="GCP Compute" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-GPLV3-1E90FF?style=for-the-badge&labelColor=2D2D2D" alt="License GPLv3" /></a>
</p>

### 🚀 What it gives you that a static landing page doesn't

| | |
|---|---|
| 🎬 **A cinematic front page** | GSAP scroll-driven storytelling with three live, GPU/canvas backgrounds (moonlit ripple, silk flow-field, rain-on-glass) and a real-time moon-phase widget — all procedural, zero binary assets. |
| 🌎 **Bilingual out of the box** | Every UI string lives in a type-safe `en` / `es` dictionary. A header switch flips the whole site between English and Spanish; TypeScript guarantees no key is ever missing. |
| 🔐 **Real auth, not a mock** | Google OAuth 2.0 → signed `jose` JWT → httpOnly session cookie, with CSRF state protection and an owner auto-promote-to-admin rule. |
| 🧩 **End-to-end type safety** | tRPC 11 over Hono means the browser calls the server through fully-typed procedures — no hand-written fetch, no drift between client and API. |
| 🗄️ **A managed schema** | Drizzle ORM + MySQL with `drizzle-kit` migrations, a seed script, and per-user persistence. |
| ☁️ **One-command deploy** | Build a Docker image, push to Artifact Registry, restart a systemd unit on the GCP VM behind NGINX/HTTPS — automated end-to-end by a Jenkins pipeline. |

### 💡 The idea behind the site

> Tlamatini's pitch is that **the toolbelt beats the parameter count.** The website has to make that pitch *felt*, not just read.
>
> So instead of a flat brochure, the front page is a scroll-driven walk through the architecture — five layers, 74 agents, 27 skills — rendered over living backgrounds. The medium is the message: a local-first tool deserves a site that does real work in your browser.

### ⚡ Quickstart (local dev in 5 minutes)

Four steps: install deps, point at a MySQL database, drop in your env vars, run the dev server.

**1 · Clone &amp; install** (Node 20+):

```bash
git clone https://github.com/XAIHT/Tlamatini.git xaiht-web
cd xaiht-web
npm ci
```

**2 · Create your env file** — copy the documented template and fill it in (full reference in [§6](#6-configuration-env)):

```bash
cp .env.example .env
# then edit .env: APP_SECRET, DATABASE_URL, GOOGLE_CLIENT_ID/SECRET, PUBLIC_BASE_URL, OWNER_GOOGLE_SUB
```

**3 · Push the schema** to your local MySQL (`mysql://root:pass@127.0.0.1:3306/xaiht`):

```bash
npm run db:push
```

**4 · Run it**:

```bash
npm run dev          # Vite + Hono dev server on http://localhost:3000
```

Open **http://localhost:3000** — the landing page renders without auth. Click **Sign in** to exercise the Google OAuth flow (you'll need an OAuth client configured, see [§2.5](#25-google-oauth-setup)).

Prefer the production path? Jump to [§7 Build &amp; Deploy](#7-build--deploy).

---

<details>
<summary><strong>📦 Recent history — click to expand</strong></summary>

> **Latest — `Implementing the Spanish/English version!`** The whole site became bilingual: every label moved into a type-safe `src/i18n/translations.ts` dictionary with `en` and `es` keys, fronted by a `LanguageProvider` and a header `LanguageSwitch`. TypeScript enforces parity between the two languages so a missing translation is a compile error, not a runtime blank.
>
> **Before that — versioned alongside the Tlamatini app.** The site tracks the product it advertises: the `/tlamatini` page mirrors the current release (v1.17.1 at time of writing — 74 agent types, 27 skills, hybrid RAG, ACPX, Unreal MCP) and its install walkthrough. Bumping the app version means refreshing the marketing copy here.

</details>

<p align="center">
  <a href="https://github.com/XAIHT/Tlamatini"><strong>📖 The Tlamatini app &amp; its docs</strong></a> &nbsp;·&nbsp;
  <a href="#10-troubleshooting"><strong>🔧 Troubleshooting</strong></a> &nbsp;·&nbsp;
  <a href="#11-contributing--license"><strong>🤝 Contributing</strong></a>
</p>

---

## Table of Contents

- [1. Overview](#1-overview)
  - [1.1. What this repo is](#11-what-this-repo-is)
  - [1.2. The tech stack](#12-the-tech-stack)
  - [1.3. Where it runs](#13-where-it-runs)
- [2. Quickstart (local dev)](#2-quickstart-local-dev)
  - [2.1. Prerequisites](#21-prerequisites)
  - [2.2. Clone and install](#22-clone-and-install)
  - [2.3. Environment file](#23-environment-file)
  - [2.4. Database (Drizzle + MySQL)](#24-database-drizzle--mysql)
  - [2.5. Google OAuth setup](#25-google-oauth-setup)
  - [2.6. Run the dev server](#26-run-the-dev-server)
- [3. Project Layout](#3-project-layout)
  - [3.1. Frontend (`src/`)](#31-frontend-src)
  - [3.2. Backend (`api/`)](#32-backend-api)
  - [3.3. Shared (`contracts/`, `db/`)](#33-shared-contracts-db)
- [4. The Frontend](#4-the-frontend)
  - [4.1. Home (`/`)](#41-home-)
  - [4.2. Tlamatini (`/tlamatini`)](#42-tlamatini-tlamatini)
  - [4.3. Login (`/login`) and NotFound](#43-login-login-and-notfound)
  - [4.4. Procedural backgrounds and the liquid-glass UI](#44-procedural-backgrounds-and-the-liquid-glass-ui)
  - [4.5. Bilingual i18n (EN / ES)](#45-bilingual-i18n-en--es)
- [5. The Backend (Hono + tRPC)](#5-the-backend-hono--trpc)
  - [5.1. Server boot](#51-server-boot)
  - [5.2. The tRPC routers](#52-the-trpc-routers)
  - [5.3. The auth flow (Google OAuth)](#53-the-auth-flow-google-oauth)
  - [5.4. Database schema](#54-database-schema)
- [6. Configuration (env)](#6-configuration-env)
- [7. Build & Deploy](#7-build--deploy)
  - [7.1. Production build](#71-production-build)
  - [7.2. Docker](#72-docker)
  - [7.3. GCP infrastructure](#73-gcp-infrastructure)
  - [7.4. Jenkins CI/CD](#74-jenkins-cicd)
  - [7.5. VM helper scripts](#75-vm-helper-scripts)
- [8. npm Scripts Reference](#8-npm-scripts-reference)
- [9. Architecture at a Glance](#9-architecture-at-a-glance)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Contributing & License](#11-contributing--license)

---

## 1. Overview

### 1.1. What this repo is

**XAIHT** is the website for **Tlamatini** (Nahuatl for *"one who knows"*), a local-first AI developer assistant. The site itself is a fullstack TypeScript app:

- a **React 19** single-page front end built with **Vite**, animated with **GSAP**, painted over live canvas/WebGL backgrounds;
- a **Hono** HTTP server exposing a fully-typed **tRPC 11** API plus a Google **OAuth 2.0** flow;
- a **MySQL** database accessed through **Drizzle ORM**, with `drizzle-kit` migrations and a seed script;
- packaged into a single **Docker** image and shipped to a **Google Cloud Compute Engine** VM behind NGINX/HTTPS by a **Jenkins** pipeline.

The same codebase serves both the rendered SPA (static assets) and the `/api/*` surface from one Node process.

License: **GPL-3.0** · Live: <https://xaiht.org> · The product it advertises: <https://github.com/XAIHT/Tlamatini>.

### 1.2. The tech stack

| Layer | Choices |
|---|---|
| **Front end** | React 19, React Router v7, Tailwind CSS v3 + shadcn/ui (Radix primitives), GSAP (ScrollTrigger), D3 (`d3-force`), `react-markdown` + `remark-gfm`, TanStack Query, `react-hook-form` + Zod |
| **API** | Hono 4, tRPC 11 (`@trpc/server` + `@trpc/react-query`), `superjson` transformer |
| **Auth** | Google OAuth 2.0, `jose` (HS256 JWT), httpOnly session cookie, CSRF state cookie |
| **Data** | Drizzle ORM 0.45, `mysql2`, `drizzle-kit` migrations |
| **Build/Tooling** | Vite 7, esbuild (server bundle), TypeScript 5.9, ESLint 9, Prettier, Vitest |
| **Deploy** | Docker (`node:20-alpine`), GCP Compute Engine + Cloud SQL (MySQL), NGINX + HTTPS, Jenkins → Artifact Registry → `systemd` |

### 1.3. Where it runs

Production is a single GCP Compute Engine VM. NGINX terminates TLS and reverse-proxies to the Node container, which serves the built SPA from `dist/public` and the API from `/api/*`. The MySQL database is Cloud SQL, reached over a local `cloud-sql-proxy`. The `systemd` unit `xaiht-app` owns the container lifecycle. Full pipeline in [§7](#7-build--deploy).

---

## 2. Quickstart (local dev)

### 2.1. Prerequisites

| Requirement | Recommended | Notes |
|---|---|---|
| Node.js | **20 LTS+** | Matches the `node:20-alpine` production base image. |
| npm | 10+ | `package-lock.json` is committed; use `npm ci` for reproducible installs. |
| MySQL | 8.x | Local instance, or point `DATABASE_URL` at any MySQL. The schema is pushed with `drizzle-kit`. |
| Google OAuth client | — | A *Web application* OAuth client (Client ID + Secret) from the [GCP credentials console](https://console.cloud.google.com/apis/credentials). Only needed to exercise sign-in. |

You do **not** need the Tlamatini desktop app, Ollama, or any of its models to run this website — those belong to the [product repo](https://github.com/XAIHT/Tlamatini).

### 2.2. Clone and install

```bash
git clone https://github.com/XAIHT/Tlamatini.git xaiht-web
cd xaiht-web
npm ci
```

### 2.3. Environment file

```bash
cp .env.example .env
```

Then fill in the values — each one is documented there and in [§6](#6-configuration-env). The app will not start without `DATABASE_URL`; OAuth needs `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`PUBLIC_BASE_URL`. `.env` is gitignored — never commit it.

### 2.4. Database (Drizzle + MySQL)

Point `DATABASE_URL` at a MySQL database, then sync the schema:

```bash
npm run db:push        # apply db/schema.ts directly (fast, dev-friendly)
# — or, the migration route —
npm run db:generate    # emit a SQL migration from schema changes
npm run db:migrate     # apply pending migrations
```

The schema (`db/schema.ts`) defines two tables — `users` and `notes` — described in [§5.4](#54-database-schema). A seed helper lives at `db/seed.ts`.

### 2.5. Google OAuth setup

1. Create a **Web application** OAuth client in the [GCP credentials console](https://console.cloud.google.com/apis/credentials).
2. Add the redirect URI: `${PUBLIC_BASE_URL}/api/oauth/callback` — for dev that's `http://localhost:3000/api/oauth/callback`.
3. Put the Client ID/Secret in `.env`, and set `PUBLIC_BASE_URL` to **exactly** the origin you registered.
4. Sign in once, then read the `unionId` column of your `users` row (it stores the Google `sub`) and set `OWNER_GOOGLE_SUB` to it — that account auto-promotes to `role=admin` on its next sign-in.

### 2.6. Run the dev server

```bash
npm run dev
```

Vite serves the React app and `@hono/vite-dev-server` mounts `api/boot.ts` for `/api/*` — both on **http://localhost:3000**. Hot-module reload covers the front end; the API reloads on save too.

```
┌──────────────────────────── http://localhost:3000 ────────────────────────────┐
│  Vite (React SPA)                          @hono/vite-dev-server (api/boot.ts)  │
│  /            → Home                        /api/oauth/start  → Google OAuth     │
│  /tlamatini   → product page                /api/oauth/callback                  │
│  /login       → sign-in                      /api/trpc/*      → tRPC router       │
│  *            → NotFound                                                          │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Project Layout

```
xaiht-web/
├── src/                  # React front end (the SPA)
│   ├── pages/            # Home, Tlamatini, Login, NotFound
│   ├── components/       # Navigation, Footer, backgrounds, UI kit (ui/)
│   ├── i18n/             # en/es dictionary + LanguageProvider
│   ├── providers/        # TRPCProvider
│   ├── hooks/  lib/  utils/  store.ts  types.ts  const.ts
│   ├── config.ts         # site config objects (title, header, backgrounds…)
│   └── main.tsx          # entry: BrowserRouter + TRPCProvider + LanguageProvider
├── api/                  # Hono + tRPC backend
│   ├── boot.ts           # server entry (dev + prod)
│   ├── router.ts         # tRPC root router
│   ├── auth-router.ts    # notes-router.ts   middleware.ts   context.ts
│   ├── kimi/             # Google OAuth (auth, platform, session, types)
│   ├── queries/          # users, connection (Drizzle)
│   └── lib/              # env, cookies, http, vite helpers
├── db/                   # schema.ts, migrations/, seed.ts, relations.ts
├── contracts/            # shared constants, error messages, types
├── public/images/        # hero & feature imagery
├── scripts/              # build-server.mjs + vm-*.sh deploy helpers
├── Dockerfile  Jenkinsfile  drizzle.config.ts  vite.config.ts
└── .env.example
```

Path aliases (see `vite.config.ts`): `@` → `src`, `@contracts` → `contracts`, `@db` / `db` → `db`.

### 3.1. Frontend (`src/`)

`main.tsx` wraps the app in `BrowserRouter`, the tRPC/React-Query provider, and the `LanguageProvider`. `App.tsx` declares four routes. Every user-visible string flows from `src/config.ts` (structural config) and `src/i18n/translations.ts` (translated copy) — not hard-coded into components.

### 3.2. Backend (`api/`)

`boot.ts` builds a Hono app that mounts the OAuth handlers and the tRPC fetch adapter, then either hands the app to Vite's dev server (development) or to `@hono/node-server` listening on `$PORT` (production). The OAuth logic lives under `api/kimi/` (the directory name is legacy — it is Google OAuth, not Kimi).

### 3.3. Shared (`contracts/`, `db/`)

`contracts/` holds values both client and server agree on — the session cookie name (`kimi_sid`), its 7-day max-age, OAuth paths, and shared error messages — so the two ends never disagree. `db/` is the single source of truth for the schema.

---

## 4. The Frontend

### 4.1. Home (`/`)

The landing page (`src/pages/Home.tsx`). A GSAP `ScrollTrigger` storyboard: an ASCII intro, an overview band with headline stats (74 agents, 27 skills, the current version, 4096 max iterations), a vision/mission/concept card grid, a scroll-stacked walk through the five-layer architecture, the agent-family workflow, a tools grid, and the footer — all over a live procedural background.

### 4.2. Tlamatini (`/tlamatini`)

The product page (`src/pages/Tlamatini.tsx`): a hero, an overview, feature cards (each with imagery from `public/images/`), a step-by-step installation walkthrough mirroring the app's own Quickstart (Ollama, model pulls, clone/venv/migrate/run), the agent families, and a tech-stack grid. This page is the on-site copy of the [product README](https://github.com/XAIHT/Tlamatini).

### 4.3. Login (`/login`) and NotFound

`Login.tsx` is a single Google **Sign in** card; authenticated visitors are redirected to `/`. Any unmatched route falls through to `NotFound.tsx` (404).

### 4.4. Procedural backgrounds and the liquid-glass UI

Three full-viewport, GPU/canvas backgrounds ship as components and need **no binary assets**:

| Component | Effect |
|---|---|
| `MoonlitRipple.tsx` | A rippling pool with a single moon reflection. |
| `FlowField.tsx` | A noise-driven vector flow-field ("silk"). |
| `RainOnGlass.tsx` | Rain on glass with droplet trails. |

`MoonPhase.tsx` renders the *current* moon phase live on a canvas. Floating panels use `backdrop-filter: blur(...)` over a semi-transparent base — the signature liquid-glass look. The palette is a warm gold accent (`#c9a96e`) over near-black, with muted green/slate-blue secondaries; type is Inter (body), IBM Plex Mono (labels), and Orbitron (display), loaded in `index.html`.

### 4.5. Bilingual i18n (EN / ES)

`src/i18n/translations.ts` holds one dictionary with `en` and `es` keys; `LanguageProvider` exposes the active language and `LanguageSwitch` (in the header) flips it. Because both languages are typed against the same shape, a missing or misspelled key fails the TypeScript build rather than rendering blank — see `npm run check`.

---

## 5. The Backend (Hono + tRPC)

### 5.1. Server boot

`api/boot.ts` constructs the Hono app, applies a body-size limit, and registers:

```
GET  /api/oauth/start      → begin Google OAuth (redirect to Google)
GET  /api/oauth/callback   → exchange code, set session, redirect to /
ALL  /api/trpc/*           → tRPC fetch handler (appRouter)
*    /api/*                → 404
```

In production it also serves the built SPA from `dist/public` and listens via `@hono/node-server` on `$PORT` (default 3000). In dev, Vite owns the listener and Hono is mounted as middleware.

### 5.2. The tRPC routers

The root router (`api/router.ts`) composes:

| Router | Procedures | Purpose |
|---|---|---|
| *(root)* | `ping` | Health check — returns `{ ok, ts }`. |
| `auth` (`auth-router.ts`) | `me`, `logout` | Current session user; clears the session cookie. |
| `notes` (`notes-router.ts`) | `list`, `create`, `read`, `update`, `delete`, `graph` | Per-user note CRUD + a wiki-link graph projection (carried from the project's note-app lineage; backed by the `notes` table). |

`middleware.ts` defines the public vs. authenticated procedures; `context.ts` builds the per-request context (DB handle + session user) from the cookie.

### 5.3. The auth flow (Google OAuth)

```
Browser ─► GET /api/oauth/start
              │  set CSRF `state` cookie (httpOnly), redirect ▼
           Google consent screen
              │  redirect back with ?code&state ▼
        GET /api/oauth/callback
              │  verify state · exchange code → tokens (api/kimi/auth.ts)
              │  fetch profile sub/name/email/picture (platform.ts)
              │  upsert users row by unionId (queries/users.ts)
              │  sign HS256 JWT (session.ts) · set `kimi_sid` cookie (7 days)
              ▼  redirect to /
```

Hardening baked in: `PUBLIC_BASE_URL` is required in production (blocks Host-header injection on the redirect URI), the session cookie is capped at **7 days**, and the OAuth `state` is held in an httpOnly cookie for CSRF protection. The account whose Google `sub` equals `OWNER_GOOGLE_SUB` is auto-promoted to `role=admin`.

### 5.4. Database schema

Two MySQL tables in `db/schema.ts`:

| Table | Columns |
|---|---|
| **`users`** | `id` (PK), `unionId` (Google `sub`, unique), `name`, `email`, `avatar`, `role` (`user`\|`admin`), `createdAt`, `updatedAt`, `lastSignInAt` |
| **`notes`** | `id` (PK), `userId`, `title`, `content`, `tags` (JSON), `source`, `createdAt`, `updatedAt` |

---

## 6. Configuration (env)

Copy `.env.example` → `.env`. Every variable is documented there; the essentials:

| Variable | Required | Meaning |
|---|---|---|
| `NODE_ENV` | — | `development` / `production`. |
| `PORT` | — | Node listen port (default `3000`). |
| `APP_SECRET` | ✅ | HS256 signing secret for session JWTs (64-char hex recommended). **Rotating it invalidates every session.** |
| `DATABASE_URL` | ✅ | MySQL DSN. Local: `mysql://root:pass@127.0.0.1:3306/xaiht`. Prod: via `cloud-sql-proxy`. |
| `GOOGLE_CLIENT_ID` | ✅* | Google OAuth Web client ID. |
| `GOOGLE_CLIENT_SECRET` | ✅* | Google OAuth Web client secret. |
| `PUBLIC_BASE_URL` | ✅* | Public origin used to build the OAuth `redirect_uri`. Must **exactly** match the registered URI (`http://localhost:3000` in dev, `https://xaiht.org` in prod). |
| `OWNER_GOOGLE_SUB` | — | Google `sub` of the account to auto-promote to `admin` on first sign-in. |

<sub>* Required to exercise sign-in. The landing pages render without auth.</sub>

> Production values live in `/etc/xaiht/app.env` on the GCP VM (see `scripts/vm-update-env.sh`), never in the repo.

---

## 7. Build & Deploy

### 7.1. Production build

```bash
npm run build      # vite build → dist/public, then bundles api/boot.ts → dist/boot.js (esbuild)
npm start          # NODE_ENV=production node dist/boot.js
```

`scripts/build-server.mjs` is the server-bundling step. The single Node process then serves the SPA and the API together.

### 7.2. Docker

The multi-stage `Dockerfile` (`node:20-alpine`) installs deps, runs `npm run build`, and ships a lean production image that runs `npm start` on port 3000:

```bash
docker build -t xaiht-app .
docker run --rm -p 3000:3000 --env-file .env xaiht-app
```

### 7.3. GCP infrastructure

```
                Internet ──► xaiht.org (DNS)
                                  │  HTTPS
                              ┌───▼────────────────────────────┐
                              │  GCP Compute Engine VM          │
                              │  NGINX (TLS) ─► node container  │
                              │     │            (dist/boot.js) │
                              │     │  systemd unit: xaiht-app   │
                              │  cloud-sql-proxy ──► Cloud SQL   │
                              └─────────────────────────│───────┘
                                                    MySQL (xaiht)
```

The container image is pulled from **Artifact Registry** (`us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app`). The `systemd` unit `xaiht-app` owns the container; restarting it pulls `:latest` and relaunches.

### 7.4. Jenkins CI/CD

`Jenkinsfile` defines the pipeline (project `xaiht-492820`, region `us-central1`):

1. **Checkout** — resolve the short SHA.
2. **Build image** — `docker build` tagged `:<sha>` and `:latest`.
3. **Push** — authenticate with the `gcp-jenkins-deployer-sa` key and push both tags to Artifact Registry.
4. **Deploy** — SSH to the VM as `jenkins-deployer`, `systemctl restart xaiht-app`, and poll `is-active` for up to 3 minutes.
5. **Smoke test** — curl `https://xaiht.org/` until it returns `200/302/304`.

### 7.5. VM helper scripts

One-off provisioning/operations live in `scripts/` (run on the VM):

| Script | Purpose |
|---|---|
| `vm-setup.sh` | Initial VM provisioning. |
| `vm-update-env.sh` | Write/refresh `/etc/xaiht/app.env`. |
| `vm-drizzle-push.sh` | Apply the Drizzle schema to Cloud SQL. |
| `vm-nginx-https.sh` | Configure NGINX + TLS. |
| `vm-rotate-secret.sh` | Rotate `APP_SECRET` (invalidates sessions). |

---

## 8. npm Scripts Reference

| Script | What it does |
|---|---|
| `npm run dev` | Vite + Hono dev server on :3000. |
| `npm run build` | Build the SPA and bundle the server into `dist/`. |
| `npm start` | Run the production server (`dist/boot.js`). |
| `npm run preview` | Preview the built SPA. |
| `npm run check` | `tsc -b` — full type-check. |
| `npm run lint` | ESLint over the repo. |
| `npm run format` | Prettier write. |
| `npm test` | Vitest run. |
| `npm run db:push` | Push `db/schema.ts` straight to the database. |
| `npm run db:generate` | Generate a SQL migration from schema changes. |
| `npm run db:migrate` | Apply pending migrations. |

---

## 9. Architecture at a Glance

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  BROWSER                                                                       │
│  React 19 SPA · React Router v7 · GSAP · D3 · Tailwind/shadcn · i18n (en/es)   │
│            │  typed calls                              │  redirect              │
│            ▼  @trpc/react-query                        ▼                        │
├──────────────────────────────────────────────────────────────────────────────┤
│  HONO SERVER  (api/boot.ts)                                                    │
│   /api/trpc/*  ─► appRouter { ping · auth · notes }   /api/oauth/{start,cb}     │
│   middleware → context (session user + DB)            Google OAuth · jose JWT   │
├──────────────────────────────────────────────────────────────────────────────┤
│  DATA                                                                          │
│   Drizzle ORM ─► MySQL  (users · notes)                                        │
└──────────────────────────────────────────────────────────────────────────────┘
            built into one Docker image ─► GCP VM (NGINX/HTTPS + systemd)
```

---

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| `npm run dev` exits immediately | Almost always a missing/invalid `DATABASE_URL`. Confirm MySQL is up and the DSN is reachable. |
| OAuth `redirect_uri_mismatch` | `PUBLIC_BASE_URL` must **exactly** match the redirect URI registered in the GCP OAuth client, including scheme and port. |
| Signed in but `auth.me` returns null | Check the `kimi_sid` cookie is set and `APP_SECRET` is identical to the one that signed it (rotating it logs everyone out). |
| Owner account isn't admin | Set `OWNER_GOOGLE_SUB` to the `unionId` value of your `users` row, then sign in again. |
| Type errors after editing copy | A translation key exists in `en` but not `es` (or vice versa). Run `npm run check` — the dictionary shape is enforced. |
| Schema changes don't take | Re-run `npm run db:push` (dev) or generate + migrate (prod). Confirm `drizzle.config.ts` points at the right DB. |
| Deploy "active" never reached | Slow Artifact Registry pull on the VM; the Jenkins poller waits 3 min. Check `journalctl -u xaiht-app` on the box. |

---

## 11. Contributing & License

### Contributing

Single-branch workflow on **`main`**. Before opening a PR: `npm run check && npm run lint && npm test`. Keep user-visible strings in `src/config.ts` / `src/i18n/translations.ts` — never hard-code copy into components, and keep the `en` / `es` dictionaries in sync.

### Acknowledgments

The marketing copy and product walkthrough describe **[Tlamatini](https://github.com/XAIHT/Tlamatini)** — the local-first AI developer assistant this site exists to showcase.

### License

**GPL-3.0** — see [LICENSE](LICENSE).

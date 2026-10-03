# Portfolio — React + NestJS technical demo

A portfolio that is itself a working full-stack system. The frontend is a React
(Vite + TypeScript + Tailwind) app; the backend is a NestJS + Prisma API with a
real database and a proxy to the **SimpleFlow AI orchestrator**. The "Technical
Demo" page lets visitors drive live API calls and watch the AI plan real tool
calls — the portfolio proves the skills instead of just listing them.

> The original single-file version is kept at [`index.html`](./index.html) for reference.

## Architecture

```
Browser (React SPA)
     │  fetch /api/*        (Vite proxies /api → :4000 in dev)
     ▼
NestJS API (/api)  ──►  Prisma  ──►  SQLite (dev) / PostgreSQL (prod)
     │
     │  POST /ai-orchestration/chat  { dryRun: true }   (token stays server-side)
     ▼
SimpleFlow AI Orchestrator  ──►  LLM plans 40+ tools
```

- **web/** — React 18, Vite, TypeScript, Tailwind, React Router, TanStack Query, Framer Motion.
- **api/** — NestJS 10, Prisma 5, class-validator. Global validation pipe + an
  activity-logging interceptor. SQLite locally, Postgres-ready (one datasource change).

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | health check |
| GET | `/api/projects?q=&tag=` | list projects (search + tag filter) |
| GET | `/api/projects/:slug` | one project |
| POST | `/api/projects` | create (Technical Demo CRUD) |
| PATCH | `/api/projects/:slug` | update |
| DELETE | `/api/projects/:slug` | delete |
| GET | `/api/ai/tools` | orchestrator tool catalogue |
| POST | `/api/ai/plan` | natural language → planned tool calls (SimpleFlow dryRun, or local fallback) |
| POST | `/api/contact` | store a contact message |

## Data model (Prisma)

`Project`, `ContactMessage`, `DemoRequest`, `ActivityLog` — see `api/prisma/schema.prisma`.

## Run it locally

Two terminals.

**1) API** (http://localhost:4000/api)
```bash
cd api
npm install
cp .env.example .env        # defaults to SQLite; no Postgres needed
npm run setup               # prisma db push + seed the projects
npm run start:dev
```

**2) Web** (http://localhost:5173)
```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173. The homepage projects load from the API; the
**Technical Demo** page (`/demo`) runs live CRUD and the AI planner.

## Wiring the real SimpleFlow orchestrator (optional)

By default `/api/ai/plan` uses a built-in heuristic planner so the demo always
works. To route through the real orchestrator, set these in `api/.env`:

```bash
SIMPLEFLOW_URL=https://your-simpleflow-api
SIMPLEFLOW_TOKEN=<a demo-account JWT>       # or SIMPLEFLOW_EMAIL + SIMPLEFLOW_PASSWORD
SIMPLEFLOW_USER_ID=1
```

Calls go out **server-side** with `dryRun: true` — the token never reaches the
browser and no SimpleFlow data is mutated.

## Deploy notes

- **Database:** change `provider` in `api/prisma/schema.prisma` to `postgresql`
  and point `DATABASE_URL` at Postgres. Run `prisma migrate deploy`.
- **Frontend:** `cd web && npm run build` → static `dist/`. Set `VITE_API_URL`
  to the API's public origin (or serve both behind one reverse proxy so `/api`
  is same-origin).

## Personal details

All placeholders live in **one file**: `web/src/lib/site.ts` (name, role,
email, GitHub, LinkedIn, location, bio). Update it and the copy in
`web/index.html` (title/meta). Project content is seeded in `api/prisma/seed.ts`.

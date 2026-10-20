# Make My Marriage

A shared, web-first workspace for planning an Indian wedding: functions, tasks, guests and
event-wise RSVPs, vendors, budget and a guest-facing invitation page.

> **Status:** project scaffold (stages 1–2). No wedding features, authentication or database yet.
> See [docs/PRD.md](docs/PRD.md), [docs/System_Design.md](docs/System_Design.md),
> [docs/Database_Design.md](docs/Database_Design.md) and [docs/decisions/](docs/decisions/).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript 6 · Zod · pino · Tailwind CSS 4 ·
Jest + React Testing Library · ESLint (Airbnb) + Prettier · GitHub Actions · Vercel (planned).

> This stack differs from the PlexiTech standard stack (React JavaScript, .NET/C#, MSSQL). The
> exception has **not** been approved yet — see
> [decision 0004](docs/decisions/0004-organizational-stack-exception.md).

Planned in later stages: Clerk (auth), MongoDB Atlas + Mongoose (data). Other services from the
System Design are deferred until their features are approved — see
[decision 0001](docs/decisions/0001-modular-monolith-and-scope.md).

## Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- npm (bundled with Node)

## Getting started

```bash
npm ci
cp .env.example .env.local   # then adjust values if needed
npm run dev                  # http://localhost:3000
```

Check the API: `curl http://localhost:3000/api/v1/health`

## Scripts

| Script              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Start the dev server                                    |
| `npm run build`     | Production build                                        |
| `npm start`         | Serve the production build                              |
| `npm run lint`      | ESLint (Airbnb ruleset)                                 |
| `npm run format`    | Format with Prettier (`format:check` to verify only)    |
| `npm run typecheck` | Generate Next.js route types, then `tsc --noEmit`       |
| `npm test`          | Run Jest (`test:watch`, `test:coverage` also available) |
| `npm run verify`    | Everything CI runs, in the same order                   |

## Environment variables

All server variables are declared and validated in [src/server/env.ts](src/server/env.ts) and
documented in [.env.example](.env.example). Startup reports invalid configuration by variable
name, never by value; requests return 500 until it is fixed.

- `.env.local` is for local development and is git-ignored. Never commit real values.
- Where deployed secrets are stored is **not yet decided** — see
  [decision 0005](docs/decisions/0005-secrets-management.md).
- When adding a variable, update `env.ts` and `.env.example` in the same change.

## Project structure

```text
src/
  app/                 Routes: pages, layouts and /api/v1 route handlers (thin)
    api/v1/health/     Liveness endpoint
  modules/             Business domains — empty until the first feature; see modules/README.md
  components/ui/       Shared UI primitives
  server/              Server-only infrastructure
    env.ts             Validated environment
    logger.ts          Structured logger with redaction
    http/              Response envelope, error types, withApi() route wrapper
  instrumentation.ts   Validates configuration at server start
tests/setup/           Jest setup
docs/decisions/        Architecture decision records
```

Added in later stages: `src/server/auth` (Clerk), `src/server/db` (MongoDB),
`src/server/authz` (wedding membership and permissions), `scripts/migrations`.

## Conventions

- **API:** REST under `/api/v1/`, standard envelope
  `{ success, data, message, errorCode, timestamp }`, handlers wrapped in `withApi()`.
  Details in [decision 0002](docs/decisions/0002-api-conventions.md).
- **Errors:** throw `AppError` subclasses for expected failures; never expose stack traces.
- **Logging:** use `logger` from `src/server/logger.ts`; `console.*` fails lint. Never log tokens,
  credentials or guest contact data.
- **Tests:** colocated `*.test.ts(x)`, Arrange / Act / Assert. UI tests start with a
  `@jest-environment jsdom` docblock. Coverage: 80% global, 95% for security-critical code.

## Git workflow

- Never commit to `main`; open a pull request. CI must pass before merge.
- Branches: `feature/<work-item-id>/<desc>`, `bugfix/<work-item-id>/<desc>`, `db/<work-item-id>/<desc>`
- Commits: `[type][work-item-id] description`, e.g. `[feat][42] add health endpoint`

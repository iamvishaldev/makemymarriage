# AGENTS.md

Instructions for AI coding agents working in this repository. Humans: see [README.md](README.md).

## Project

Make My Marriage — a web-first Indian wedding management platform: one shared workspace per
wedding with events, tasks, guests and per-event RSVPs, vendors, budget, and a no-account guest
invitation page. Currently a **scaffold**: no auth, database or product features yet.

Source of truth, in order: [docs/PRD.md](docs/PRD.md) (scope) →
[docs/decisions/](docs/decisions/) (accepted decisions) → [docs/System_Design.md](docs/System_Design.md)
and [docs/Database_Design.md](docs/Database_Design.md) (technical intent; partly superseded by
decision 0001). Do not edit the three spec documents unless asked.

## Commands

```bash
npm ci                    # install (npm only; package-lock.json is the lockfile)
npm run dev               # dev server on :3000 (needs .env.local — copy .env.example)
npm run verify            # everything CI runs: format:check, lint, typecheck, test:coverage, build
npm test -- path/to/file  # single test file
npm run lint:fix && npm run format
```

Run `npm run verify` before declaring work done. Never claim a check passed without running it.

## Stack and pinned versions

Next.js 16 (App Router) · React 19 · TypeScript 6.0 (strict) · Zod 4 · pino · Tailwind 4 ·
Jest 30 + React Testing Library · ESLint 9 with `eslint-config-airbnb-extended` · Node 24 · npm.

- **Do not upgrade** TypeScript to 7 or ESLint to 10: typescript-eslint and the React/import/a11y
  plugins do not support them yet (decision 0003).
- Install dependencies with `--save-exact`, and only in the stage that first needs them.
- In Next.js 16, middleware lives in `src/proxy.ts`, not `middleware.ts`.

## Layout

```text
src/app/              Routes only: pages, layouts, /api/v1 route handlers. Thin — no business logic.
src/modules/<domain>/ Business logic per domain (see src/modules/README.md). Created per feature.
src/server/           Server-only infrastructure: env.ts, logger.ts, http/ (later: auth/, db/, authz/)
src/components/ui/    Shared presentational primitives
tests/setup/          Jest setup; colocated *.test.ts(x) everywhere else
docs/decisions/       ADRs — add one when making or reversing an architectural decision
```

## Rules

### API

- REST route handlers under `/api/v1/`, every handler wrapped in `withApi()` from
  `src/server/http/handler.ts`. Handlers return `{ data, status?, message? }`.
- Every response uses the envelope `{ success, data, message, errorCode, timestamp }`.
- Server Components read by calling module services directly; do not add server actions.
- Expected failures throw an `AppError` subclass (`src/server/http/errors.ts`). Never return stack
  traces or internal messages. Validate input with Zod; a thrown `ZodError` becomes a 400.
- Return DTOs, never raw database documents.

### Security (non-negotiable)

- Files that touch secrets, the database or auth start with `import 'server-only'`. Client
  components (`'use client'`) must never import from `src/server/` or a module's `service.ts`/`model.ts`.
- Read configuration only via `env` from `src/server/env.ts`. A new variable goes into the Zod
  schema **and** `.env.example` in the same change. Never commit real `.env*` files or secrets.
- Log only through `logger` (`console.*` fails lint). Never log request bodies, tokens, cookies,
  authorization headers, emails, phone numbers or guest notes. Add new sensitive keys to
  `REDACTED_KEYS` in `src/server/logger.ts`.
- Bearer tokens (guest invitation links, etc.) never go in API paths or query strings — paths are logged.
- Once auth exists: every wedding-scoped query filters by both the record ID **and** `weddingId`,
  after a membership/permission check. Records in another wedding return `NotFoundError`, not
  `ForbiddenError`. UI hiding is not authorization.

### Scope

- MVP scope is the PRD's "Must" items. Vendors are in the MVP.
- **Deferred — do not add** without explicit approval: photo gallery / Cloudflare R2, livestream,
  Google Places, Ably, Resend / email jobs / cron, vendor login, WhatsApp automation.
- **Never add**: Redis, Kafka, queues, microservices, a separate backend, tRPC/GraphQL, Prisma,
  NextAuth, Redux, or a repository layer "for later".
- Clerk and MongoDB/Mongoose are planned but **not approved to implement** yet; wait for the user.

### Open decisions — do not assume an answer

- **0004** Organizational stack exception (PlexiTech standard is React JS / .NET / MSSQL): not approved.
- **0005** Secrets management (Key Vault vs platform env vars): undecided. Do not add either.
- Also open: guest link granularity, role/permission matrix, plus-one policy, budget payment model,
  rate-limiting approach. Ask the user when work depends on one.

### Testing

- Write or update unit tests with every logic change. Colocate as `*.test.ts(x)`; use explicit
  `// Arrange`, `// Act`, `// Assert` sections.
- Jest defaults to the Node environment. UI tests begin with a `/** @jest-environment jsdom */` docblock.
- `server-only` is stubbed in Jest; `tests/setup/env.ts` provides test env values.
- Coverage thresholds: 80% global; 95% for `src/server/http/` and, when added, auth, authorization
  and token code. Add a per-path threshold in `jest.config.mjs` for each new security-critical folder.

### Code style

- Airbnb ESLint + Prettier (single quotes, trailing commas, width 100). Fix lint; do not disable
  rules inline. A justified exception goes in `eslint.config.mjs` with a comment explaining why.
- Functional React components only. Next.js pages/layouts use default exports; route handlers and
  `instrumentation.ts` use the named exports Next.js requires. Elsewhere, Airbnb's
  `prefer-default-export` applies: a file with a single export uses a default export.
- Import with the `@/` alias. Keep functions under ~50 lines and files under ~300 lines.
- No dead code, debug output or stale TODOs. Match the comment density of surrounding code.

## Git

- Never commit or push to `main`. All changes reach `main` via pull request with passing CI.
- Branches: `feature/<work-item-id>/<desc>`, `bugfix/<work-item-id>/<desc>`, `db/<work-item-id>/<desc>`.
  `dev` is the current integration branch.
- Commit messages: `[type][work-item-id] description` (e.g. `[feat][42] add events list`). Ask for
  the work item ID if you do not have it.
- Commit, push or open PRs only when the user asks.

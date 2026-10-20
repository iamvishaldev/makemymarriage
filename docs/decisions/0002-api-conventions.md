# 0002 — API, error and logging conventions

**Status:** Accepted · **Date:** 2026-10-20

## Context

PlexiTech API standards require versioned REST endpoints, a standard response wrapper, DTOs and
safe errors. The System Design leaves the choice between route handlers and server actions open.

## Decision

- **Transport:** mutations and client-consumed reads are REST route handlers under `/api/v1/`.
  Server Components read by calling module services directly (same code path, no HTTP hop).
  Server actions are not used for now.
- **Envelope:** every API response is `{ success, data, message, errorCode, timestamp }`
  (`src/server/http/response.ts`). Validation failures put field errors in `data`.
- **Handlers** are wrapped in `withApi()` (`src/server/http/handler.ts`), which assigns or
  propagates `x-request-id`, maps errors to the envelope, sets `Cache-Control: no-store` and logs
  one completion line.
- **Errors:** expected failures throw an `AppError` subclass (`src/server/http/errors.ts`).
  Anything else becomes a generic `INTERNAL_ERROR` 500; detail goes to server logs only.
  Records in another wedding return `NOT_FOUND`, never `FORBIDDEN`, to avoid confirming existence.
- **Logging:** `src/server/logger.ts` (pino, JSON). Credentials, tokens and guest contact fields are
  redacted. Only the request path is logged, so bearer tokens must never appear in API paths or
  query strings; send them in the body or a header.
- **Auth default:** from the Clerk stage on, routes are protected by default and public routes
  (health, guest invitation/RSVP, published website) are explicitly allow-listed.

## Consequences

- One consistent contract for web and any future client; OpenAPI docs can be generated from the
  Zod schemas once the first resource endpoints exist.
- Forms post to `/api/v1` rather than using server actions, which is slightly more code per form.

# 0001 — Modular monolith and MVP scope reconciliation

**Status:** Accepted (confirmed by the project owner for the Phase 1 scaffold) · **Date:** 2026-10-20

Acceptance here is a project-level decision. It does not grant the organizational stack
exception, which remains open in [0004](0004-organizational-stack-exception.md).

## Context

The System Design RFC selects Next.js, TypeScript, MongoDB Atlas + Mongoose, Zod, Clerk, Ably,
Cloudflare R2, Resend, Vercel Cron and Google Places. The PRD (the scope authority) defers the
photo gallery, livestreaming and automated messaging, and says maps can start as a plain address
plus an external link. The Database Design marks gallery collections as "Core" but vendors as
"Optional later", although PRD VEN-01/02 are Must.

## Decision

1. One deployable Next.js application (App Router, TypeScript), organised as a modular monolith:
   `src/modules/<domain>` for business logic, `src/server` for shared infrastructure, `src/app`
   for routes and UI. No separate backend service, microservices, Redis or message broker.
2. The PRD wins on scope. Deferred until their feature is approved: photo gallery (R2,
   `photoAssets`, `guestAccessLinks`), livestream URLs, Google Places, Ably realtime, and the
   Resend + Cron email pipeline.
3. `vendors` is an MVP collection; `vendorBookings` stays deferred.
4. Dependencies are added in the stage that first uses them, not up front.

## Consequences

- The initial scaffold depends only on Next.js, React, Zod and pino at runtime.
- The Database Design needs a follow-up revision for: vendors in MVP, a guest invitation-link
  token model, payments/partial payments on expenses, and single ownership of website settings.
- Open product decisions (guest link granularity, role matrix, plus-ones, email verification)
  are resolved in the stage that needs them and recorded here.

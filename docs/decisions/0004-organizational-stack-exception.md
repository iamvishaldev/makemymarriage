# 0004 — Organizational stack exception

**Status:** Open — approval **not** granted · **Date:** 2026-10-20

## Context

PlexiTech's standard stack is React (JavaScript) for the frontend, .NET C# REST APIs for the
backend, MSSQL Server for data, and TFS / Azure DevOps for version control. This project uses:

| Area            | PlexiTech standard | This project                     |
| --------------- | ------------------ | -------------------------------- |
| Frontend        | React (JavaScript) | React via Next.js (TypeScript)   |
| Backend         | .NET C# REST APIs  | Next.js Route Handlers (Node.js) |
| Database        | MSSQL Server       | MongoDB Atlas + Mongoose         |
| Version control | TFS / Azure DevOps | GitHub + GitHub Actions          |
| Hosting         | —                  | Vercel (planned)                 |

The project documents (System Design RFC, Database Design) select this stack. Nobody with
authority over PlexiTech standards has approved the deviation.

## Decision

None yet. The Phase 1 scaffold proceeds on this stack at the project owner's direction, with the
exception recorded as unresolved.

## How the standards are applied meanwhile

Standards that are not tied to a specific stack are followed: versioned REST APIs (`/api/v1`), the
standard response envelope, DTOs (no raw DB entities), safe errors with no stack traces,
deny-by-default authorization (from the auth stage onward), audit logging, no `console` output in
production code, the Airbnb ESLint ruleset, Jest + React Testing Library with colocated AAA tests,
80% / 95% coverage, branch and commit naming, and PR-only merges.

Stack-specific standards will need agreed equivalents if the exception is approved, for example:
.NET libraries (FluentValidation, AutoMapper, ILogger, StyleCop) → Zod, explicit DTO mappers,
pino, ESLint; MSSQL conventions (TDE, Always Encrypted, `GETUTCDATE()`, `is_deleted`,
`usp_` procedures) → Atlas encryption at rest, application-level field encryption, UTC BSON dates,
`archivedAt` soft delete; TFS work items → GitHub issues or linked Azure Boards items.

## Consequences

- If the exception is rejected, the architecture must be re-planned before feature work; the
  scaffold's conventions (envelope, error model, tests) carry over, but the runtime does not.
- Database and authentication stages should not start until this is resolved, because they lock in
  MongoDB and Clerk.

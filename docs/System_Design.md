Indian Wedding Management Platform

System Design RFC

DRAFT — Architecture decisions consolidated; implementation details may evolve

| Status | Draft |
| --- | --- |
| Owner | Product / Engineering |
| Last updated | October 16, 2026 |
| Scope | Architecture and implementation baseline for the first web release |

### Purpose

A practical, maintainable architecture for coordinating Indian weddings across multiple functions, with strong workspace isolation and guest-friendly invitation, RSVP, and photo-sharing flows.

## 1. Executive Summary

This RFC proposes a web-first Indian Wedding Management Platform for couples, families, and organizers coordinating weddings of approximately 150–500 guests across multiple functions. It covers wedding workspaces, events, tasks, budgets, vendors, guests, invitations, RSVPs, wedding pages, livestream links, and a private photo gallery.

The first release uses a modular monolith built with Next.js, TypeScript, and Node.js on Vercel. MongoDB Atlas with Mongoose is the primary datastore; Zod validates external inputs. Clerk handles identity, while the application owns wedding membership and authorization. Ably provides real-time notifications, Cloudflare R2 stores original photos, Resend delivers email, Vercel Cron processes email jobs, and Google Places API (New) supports venue lookup.

Principle: prefer managed services, clear module boundaries, and secure defaults. MongoDB is the source of truth; external services provide identity, notifications, file storage/delivery, email, and place lookup.

## 2. Goals and Non-Goals

### Goals

- Support multiple wedding workspaces and users who belong to more than one wedding.
- Support wedding-wide and event-specific planning.
- Send individual invitations and track RSVP independently per guest and event, without guest accounts.
- Allow organizers to upload photos and guests to view/download through unique links.
- Enforce tenant isolation, role checks, token safety, rate limiting, backups, and recovery.

### Non-goals for v1

- Microservices, Kafka, Redis infrastructure, or a custom distributed queue.
- Guest accounts, vendor marketplace, vendor booking/payment processing, or custom livestream hosting.
- A custom image-processing pipeline or permanent storage of every image variant.
- Arbitrary embed HTML, public-by-default private photos, or photo binaries stored in MongoDB.

## 3. Product Scope and Workflows

### Management workspace

Each wedding workspace contains members and roles, events/functions, tasks, budget and expenses, vendors, guests, invitations/RSVPs, gallery albums, and settings. The dashboard summarizes upcoming events and planning progress.

### Invitation and RSVP

Organizers invite individual guests to selected functions. A personalized page shows the couple’s names, event details, venue/address/map link, invitation message, and RSVP action. Invitations can be shared through WhatsApp links. Guests do not sign in. RSVP states are not invited, pending, accepted, and declined, independently per guest and event.

### Gallery

Only authorized organizers upload, organize, and delete photos. Guests use unique links to view/download permitted content. Links are revocable and token secrets are stored as hashes. A link is a bearer credential: forwarding it may grant access until expiry or revocation. Private image authorization must be checked before delivery.

### Other v1 capabilities

- Task assignments, due dates, priorities and status.
- Budget and expense tracking; INR is the initial currency default, with currency configurable per wedding.
- Existing vendor records; Google Places assists venue lookup, with manual entry as fallback.
- Public or unlisted wedding page visibility selected by the couple.
- Validated YouTube livestream URL per event; no arbitrary embed HTML.

## 4. Proposed Architecture

The system is one deployable Next.js application with separated domain modules and shared server-side infrastructure. Do not split into services until scale, team ownership, or operational requirements justify the cost.

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Application | Next.js, TypeScript, Node.js, Vercel | UI, server endpoints, domain modules and access checks |
| Identity | Clerk | Authentication and session identity |
| Database | MongoDB Atlas + Mongoose | Durable application state, indexes, memberships, RSVPs and jobs |
| Validation | Zod | Request payloads and environment/config validation |
| Realtime | Ably | Authorized delivery of minimal update notifications |
| Photo delivery | Cloudflare R2 + on-demand transformations/CDN | Private originals and optimized image delivery |
| Email | Resend | Transactional and invitation email |
| Scheduling | Vercel Cron + MongoDB job records | Bounded batch processing, retries and outcomes |
| Place lookup | Google Places API (New) | Venue lookup subject to provider terms |

Request path: browser → Next.js server → Zod validation → Clerk session verification → wedding membership/role authorization → domain logic → MongoDB write. After durable writes, publish minimal Ably notifications. Cron claims persisted email jobs and sends through Resend. Private media access is separately authorized.

## 5. Component Responsibilities and Failure Modes

| Component | Responsibility | Failure behavior |
| --- | --- | --- |
| Next.js | UI, APIs and domain orchestration | Return safe errors; never bypass authorization |
| Clerk | Management-user identity | Fail closed for protected actions if session is invalid/unverifiable |
| MongoDB | Source of truth | Do not report success for failed writes; recover using tested backups |
| Ably | Realtime notifications | Persisted writes remain valid; retry notification or let client refresh |
| R2/image delivery | Private originals and optimized images | Fail closed for private media; no public fallback URL |
| Resend | Email delivery | Persist status; retry transient failures; surface terminal failures |
| Vercel Cron | Trigger bounded job runs | Overlapping runs must be safe; overdue jobs remain eligible |
| Google Places | Place lookup | Manual venue entry fallback; respect attribution/storage terms |

## 6. Data Model

Use separate documents for independently queried entities. Every wedding-owned record should include weddingId or have a documented parent relationship. Every server operation must enforce the wedding boundary; avoid one giant wedding document.

| Model | Illustrative fields | Rules |
| --- | --- | --- |
| Wedding | name, coupleNames, timezone, currency, websiteVisibility | Workspace root; explicit timezone |
| WeddingMember | weddingId, userId, role, status | Unique weddingId + userId |
| WeddingMemberInvitation | email, weddingId, role, tokenHash, expiresAt, status, invitedBy, acceptedBy, acceptedAt | Never store raw token; single-use/revocable |
| Event | weddingId, name, startsAt, timezone, venueName, address, lat, lon, placeId, directionsUrl, livestreamUrl | Validate coordinates and URL |
| Guest | weddingId, name, phone, email, notes, tags | No guest login in v1 |
| GuestEventInvitation / RSVP | weddingId, guestId, eventId, status, tokenHash, expiresAt, respondedAt | Unique guest-event relationship |
| Task | weddingId, title, assigneeMemberId, eventId, dueAt, status, priority | Role-check changes |
| Expense | weddingId, description, amountMinor, currency, category, paidAt, vendorId | Use integer minor units for money |
| Vendor | weddingId, name, category, contacts, notes, placeId | Follow Google Places terms |
| Gallery / Album | weddingId, name, visibility, eventIds, createdBy | Defines gallery scope |
| PhotoAsset | weddingId, albumId, objectKey, contentType, sizeBytes, uploadedBy, createdAt, deletedAt | Binary in R2; metadata in MongoDB |
| EmailJob | weddingId, type, payloadRef, status, attempts, nextAttemptAt, claimedAt, idempotencyKey, lastError | Durable and retryable |
| AuditEvent (recommended) | weddingId, actorId, action, entityType, entityId, createdAt | Log security-sensitive actions |

- Index common workspace queries and enforce unique membership/RSVP relationships.
- Validate ownership in server-side data access, not only in UI.
- Store coordinates numerically and validate ranges.
- Use a documented deletion and retention strategy.

## 7. API and Contract Conventions

Finalize exact endpoint paths during implementation. Prefer resource-oriented server routes or well-defined server actions, with shared domain services so business rules are not duplicated.

| Domain | Representative operations | Required checks |
| --- | --- | --- |
| Membership | Create workspace, invite/accept/revoke member | Valid session, role, token hash/expiry/status, atomic one-time acceptance |
| Events | Create/update event, search places, update venue/livestream | Membership and role; Zod; valid URL/coordinates |
| Guests / RSVP | Create guest, invite to event, read invitation, submit RSVP | Guest token scope, status, rate limits, idempotent update |
| Planning | Tasks, expenses, vendors CRUD | Wedding scope, role, validated amounts/dates |
| Gallery | Authorize upload, finalize upload, list photos, download, revoke link | Organizer-only upload; scoped private access; size/type limits |
| Email | Enqueue sends, inspect status, retry failures | Role check, idempotency key, batch limits |
| Realtime | Authorize Ably channel subscription | Server-side permission checks; no sensitive payloads |

- Validate all external input with Zod; validate configuration at startup/deployment.
- Use consistent errors without stack traces, tokens, or provider secrets.
- Paginate list/search operations and cap query sizes.
- Allowlist expected YouTube URL formats; reject raw embed HTML.

## 8. Request Lifecycles

### Protected management request

1. Validate input with Zod.
1. Verify Clerk session on the server.
1. Resolve wedding and confirm active membership plus required role.
1. Load only records scoped to weddingId; apply domain rules.
1. Persist to MongoDB before reporting success.
1. Publish minimal Ably event after persistence; notification failure does not undo committed state.
1. Return response and log correlation IDs without secrets or unnecessary guest data.

### Guest RSVP

1. Guest opens a high-entropy invitation link.
1. Hash token; find active invitation and verify expiry, revocation, wedding, guest and event scope.
1. Show only authorized invitation/event information.
1. Validate RSVP and update the guest-event record idempotently.
1. Record response time and notify authorized management subscribers.

### Photo upload and download

1. Organizer requests upload authorization; check role, album, size and content type.
1. Issue short-lived, narrowly scoped authorization for a private R2 object key.
1. Verify upload completion and store PhotoAsset metadata.
1. Guest requests image through unique link; validate token and gallery scope.
1. Issue short-lived authorized access or proxy image; prevent public transformation URL bypass.

### Email processing

1. Create durable EmailJob records with stable idempotency keys.
1. Vercel Cron triggers a bounded worker run.
1. Atomically claim eligible jobs and record lease/attempt metadata.
1. Send through Resend and record result; retry transient failures with backoff.
1. Expose terminal failures and make repeated cron runs safe.

## 9. Consistency and Idempotency

| Scenario | Expected behavior | Mechanism |
| --- | --- | --- |
| Repeated RSVP | Same result, no duplicate record | Unique guest-event key; idempotent update |
| Member invite accepted twice | Only one membership created | Atomic status transition; unique weddingId + userId |
| Overlapping Cron runs | One active claimant per job | Atomic claim, lease expiry, attempt count |
| MongoDB write succeeds, Ably fails | State remains committed | MongoDB is source of truth; retry notification/refresh |
| R2 upload succeeds, metadata fails | Photo not shown as completed | Finalize step and orphan-object reconciliation |
| Email timeout after provider may have sent | Avoid duplicates where supported; handle ambiguity | Stable job ID and provider idempotency where available |
| Guest link revoked | Future access denied | Check revocation each time; short-lived media URLs |

Do not promise end-to-end exactly-once behavior across MongoDB and external providers. Design for at-least-once job execution, idempotent transitions, bounded retries, and explicit ambiguous-outcome handling.

## 10. Security and Privacy

### Authentication and authorization

- Clerk authenticates; application-owned WeddingMember records determine workspace access and roles.
- Enforce tenant isolation in server-side functions for every protected read and write.
- Use least-privilege roles and deny by default. UI visibility is not authorization.
- Store invitation and gallery token hashes, not raw secrets; use high entropy, expiry, scope, single-use where applicable, and revocation.
- Because email verification is disabled, an email address is not proof of mailbox ownership; do not grant authority based only on an email string.

### Photos and guest links

- Do not expose private originals through permanent public object URLs.
- Authorize guest access before issuing short-lived image/download URLs; test CDN caching and transformations for bypasses.
- Only organizers upload/delete; guests view/download only.
- Enforce upload limits, content type and file signature checks, generated object keys, and safe download headers.
- Forwarded links and already-downloaded images cannot be reliably recalled; communicate this limitation.

### Application security

- Use shared/distributed rate limiting; in-memory counters alone are insufficient on distributed instances.
- Keep secrets in server environment settings; never expose provider credentials to clients.
- Never log passwords, session tokens, raw invitation tokens, signed media URLs, or unnecessary guest contact data.
- Use HTTPS, secure session defaults, request-size limits, dependency updates and least-privilege credentials.
- Maintain MongoDB backups and test restoration; define privacy, deletion and retention obligations before launch.

## 11. Trade-offs and Alternatives

| Decision | Benefit | Trade-off / guardrail |
| --- | --- | --- |
| Modular monolith | Fast iteration, simple deployment | Keep modules clear; split only when justified |
| Clerk | Managed identity and session handling | Vendor dependency; keep app authorization independent |
| MongoDB + Mongoose | Flexible document model and managed database | Indexes, schema evolution and tenant scoping need discipline |
| Ably | Managed realtime delivery | Extra cost; events are hints, not source of truth |
| R2 + on-demand transforms | Avoids permanent duplicate variants | Private authorization and CDN cache rules require care |
| Resend + Cron + MongoDB jobs | Simple durable scheduling | Cron overlaps/delays; atomic claims and retries required |
| Google Places | Convenient venue lookup | Provider terms, attribution, quota and storage rules apply |
| Microservices / Kafka | Independent scaling | Unnecessary operational complexity for initial scope |
| Public photo URLs | Simple sharing | Rejected because they conflict with private guest access |

Verify current pricing, free-tier limits, provider terms, regional availability, and expected usage cost before production; provider terms and limits may change.

## 12. Operations and Launch Readiness

### Observability

- Start with Vercel logs and structured application logs with request/correlation IDs.
- Track request errors/latency, RSVP outcomes, email job age/failures, upload failures, Ably errors, database connectivity, and storage/egress costs.
- Alert on stuck jobs, repeated provider errors, elevated 5xx, backup failures and unusual cost changes.
- Set numeric SLOs after traffic assumptions and latency requirements are measured; establish targets before broad rollout.

### Backup and deployment

- Enable suitable MongoDB Atlas backups/PITR for the selected tier and document a tested restore procedure.
- Define R2 object protection, accidental deletion recovery and metadata/object reconciliation.
- Version schema/index changes; prefer backward-compatible deployment steps.
- Use separate development, staging and production environments with separate credentials.
- Pilot with a small number of weddings; document rollback and support procedures.

### Launch gates

- Cross-wedding authorization tests pass for every protected endpoint.
- Member invitation acceptance, RSVP replay, token expiry and gallery revocation tests pass.
- Private media access is tested against direct URL sharing and CDN cache behavior.
- Email worker tested for overlapping Cron runs, provider timeouts, retries and terminal failures.
- Backup restoration and orphaned-object recovery rehearsed.
- Rate limits, upload constraints, secret handling and basic operational alerts enabled.

## 13. Open Decisions and Assumptions

Core technology decisions are agreed. The following are implementation policies to finalize; they do not block the architecture baseline.

- Finalize roles and permissions (for example owner/admin/organizer/viewer), including deletion and member-invitation authority.
- Decide whether a guest link covers the whole gallery or selected albums/events; define expiration and regeneration defaults.
- Define photo deletion recovery window and retention policy.
- Set upload size/type limits and decide whether upload scanning is required at launch.
- Select production region(s) based on latency, provider support and applicable privacy/data requirements.
- Confirm email consent/opt-out rules and invitation messaging policies.
- Define SLOs and budget alerts after traffic assumptions and pricing are validated.
- Choose public versus unlisted wedding-page default; public access should be explicit.
Assumptions in this RFC: INR is the initial currency default; wedding/event timezones are explicit; guests do not have accounts; only organizers upload photos; guests view/download using unique links; public access is opt-in; all private access is checked server-side.

## 14. Implementation Roadmap

| Milestone | Deliverable | Exit criteria |
| --- | --- | --- |
| M1 — Foundation | Next.js/TypeScript structure, environments, Clerk, MongoDB/Mongoose, Zod, roles and tenant access helpers | Authentication, workspace creation and cross-tenant denial tests pass |
| M2 — Planning core | Workspaces, members, events, tasks, vendors, budget/expenses | CRUD flows work with role checks, indexes and validation |
| M3 — Guests and invitations | Guest list, per-event invitations, personalized pages, RSVP and WhatsApp-shareable links | Independent RSVP, expiry/revocation and replay tests pass |
| M4 — Gallery and realtime | Organizer R2 uploads, transformations, unique guest links, Ably updates | Private media, revocation, upload constraints and channel authorization verified |
| M5 — Email and integrations | Resend jobs, Cron worker, Google Places lookup, YouTube URL validation | Retries, duplicate/timeout cases and manual fallbacks tested |
| M6 — Pilot and launch | Logs/alerts, backup drill, rate limits, security review, limited pilot | Launch gates passed, critical issues resolved, rollback/support ready |

Recommended rollout: internal testing → small real-world pilot → broader release after privacy/security checks and operational recovery are exercised.

## 15. Decision Summary

Proceed with Next.js, TypeScript, Node.js and Vercel as a modular monolith; MongoDB Atlas with Mongoose as the source of truth; Zod for boundary validation; Clerk for identity; Ably for realtime; Cloudflare R2 for private photo storage and on-demand delivery; Resend plus Vercel Cron/MongoDB job records for email; and Google Places API (New) for venue lookup.

The largest risks are tenant isolation, bearer-link security, private image delivery/CDN behavior, duplicate or retried email jobs, and recovery. Test these explicitly before broad launch. This is a draft architecture baseline; exact endpoint paths, final role matrix, operational SLOs, and retention rules may be refined during implementation.

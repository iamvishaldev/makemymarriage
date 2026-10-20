## Work item

<!-- Every PR links a work item. Commit format: [type][work-item-id] description -->

Work item: #

## What changed and why

## How it was tested

## Checklist

- [ ] Branch follows `feature|bugfix|db/<work-item-id>/<short-description>`
- [ ] Unit tests added or updated for every logic change (AAA pattern, colocated)
- [ ] Wedding-scoped data access checks membership and filters by `weddingId`
- [ ] Inputs validated with Zod; responses use DTOs and the standard envelope
- [ ] Audit events recorded for create/update/delete of important data
- [ ] No secrets, tokens, guest contact data or `console.*` in code or logs
- [ ] New environment variables added to `src/server/env.ts` and `.env.example`
- [ ] Docs / decision records updated if a convention changed

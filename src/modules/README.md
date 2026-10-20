# Domain modules

One folder per business domain (`weddings`, `members`, `events`, `tasks`, `guests`, `invitations`,
`vendors`, `budget`, `website`, `audit`). A folder is created only when its feature is approved and
built; none exist in the scaffold.

```text
modules/<domain>/
  schemas.ts        Zod input schemas — isomorphic, so client forms can reuse them
  model.ts          Mongoose schema and indexes            (import 'server-only')
  service.ts        Business rules and wedding-scoped data access (import 'server-only')
  dto.ts            Database document → response shape; never return raw documents
  service.test.ts   Colocated tests (Arrange / Act / Assert)
```

Rules:

- Route handlers and Server Components call services; they hold no business logic.
- Services receive an already-authorized wedding context (added with the authorization stage) and
  filter every query by `weddingId`. They never trust a `weddingId` taken straight from the request.
- Modules may import from `src/server/` (and `src/lib/` once it exists), and from another module's `service.ts`
  only — never another module's `model.ts`.
- No separate repository layer unless a module's queries become complex enough to need one.

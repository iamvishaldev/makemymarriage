# 0003 — Tooling baseline and version pins

**Status:** Accepted · **Date:** 2026-10-20

## Context

PlexiTech standards require the Airbnb ESLint ruleset, Jest + React Testing Library, colocated
tests and 80% / 95% coverage. Several latest releases do not yet work together.

## Decision

| Tool       | Version                         | Why this version                                                                                                                                                                 |
| ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js    | 24 LTS                          | Current LTS; pinned in `.nvmrc` and `engines`.                                                                                                                                   |
| npm        | bundled                         | No extra tooling to install; lockfile committed.                                                                                                                                 |
| TypeScript | 6.0.x                           | TypeScript 7 is released, but `typescript-eslint` supports `<6.1`.                                                                                                               |
| ESLint     | 9.39.x                          | ESLint 10 is current, but `eslint-plugin-react`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y` and the Airbnb config still require ESLint 9. npm marks 9.x as out of support. |
| Airbnb     | `eslint-config-airbnb-extended` | The original `eslint-config-airbnb` does not support flat config or TypeScript.                                                                                                  |
| Jest       | 30.x                            | Org standard; configured through `next/jest`.                                                                                                                                    |
| Tailwind   | 4.x                             | Utility CSS with design tokens in `src/app/globals.css`.                                                                                                                         |

Every dependency is pinned to an exact version (`save-exact`).

Documented lint exceptions live in `eslint.config.mjs` with a reason beside each one.

## Consequences

- Revisit ESLint 10 and TypeScript 7 when the React/import plugins and `typescript-eslint`
  support them; track this as a maintenance work item.
- Coverage thresholds: 80% global; 95% for `src/server/http/`. Auth, authorization and token
  code get 95% thresholds as they are added.

# CLAUDE.md

@AGENTS.md

## Claude Code notes

- `AGENTS.md` (imported above) is the single source of project instructions shared with other
  agents. Put new project-wide rules there, not here; keep this file for Claude-specific notes only.
- Stop at the end of each approved stage and wait for the user before starting the next one
  (auth, database, then feature modules). Planning requests mean no file changes.
- When a task depends on an open decision (see AGENTS.md), ask instead of choosing silently, and
  record the outcome as a new ADR in `docs/decisions/`.
- Before claiming completion, run `npm run verify` and report actual results, including failures.

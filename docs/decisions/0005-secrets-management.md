# 0005 — Secrets management

**Status:** Open — undecided · **Date:** 2026-10-20

## Context

PlexiTech standards say secrets must not live in config files and should use Azure Key Vault. The
System Design RFC assumes server environment settings on the hosting platform. The scaffold needs
no secrets; Clerk and MongoDB will introduce the first ones.

## What is decided

- Application code reads configuration only through `src/server/env.ts`, which validates it with
  Zod. The source of the values (local file, platform settings or a vault) can change without
  touching application code.
- Real `.env*` files are git-ignored; only `.env.example` (names and non-secret defaults) is committed.
- Validation errors name the invalid variables and never print their values.

## What is not decided

Where preview and production secrets are stored and how they reach the runtime. Options include
hosting-platform environment variables, Azure Key Vault (fetched at runtime or synced at deploy
time), or another managed vault. This must be decided before the first secret (Clerk keys) is used
outside local development.

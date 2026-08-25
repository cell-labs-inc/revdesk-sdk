---
name: revdesk-api
description: Build or operate RevDesk API integrations with the official SDK, CLI, OpenAPI contract, scoped API keys, webhooks, rate limits, and safe approval boundaries.
---

# RevDesk API

## When to use this skill

Use this skill when a user asks to integrate with, script, or operate the RevDesk REST API.

## Discover before acting

1. Read the canonical developer directory at `https://www.revdesk.com/developers`.
2. Use `https://www.revdesk.com/openapi.json` as the source of truth for paths, schemas, operation
   IDs, required scopes, rate limits, and deprecation signals.
3. Prefer `@revdesk/sdk` for TypeScript and `npx @revdesk/sdk` for one-off CLI requests.
4. Use `https://docs.revdesk.com/api-reference` for concepts and recovery guidance.

## Authenticate safely

- A user creates an organization-scoped key in RevDesk under **Settings → API Keys**.
- Request only the scopes the task needs. Read endpoints generally require `*:read`; mutations
  require the corresponding `*:write` scope.
- Send the key only as `Authorization: Bearer <key>` and keep it in a secret or environment store.
- Read the `WWW-Authenticate` challenge and RFC 9728 metadata when a request returns 401 or 403.

## Execute

- Inspect before mutating.
- Ask for user approval before calls, messages, purchases, hangups, or other external side effects.
- Use idempotency keys on retryable mutations when the OpenAPI operation supports them.
- Honor `RateLimit`, `RateLimit-Policy`, and `Retry-After`; do not retry 4xx responses blindly.
- Prefer signed webhooks over polling for long-running outcomes.

RevDesk reaches real phone and messaging networks. For development, use a separate least-privilege
key and approved test destinations.

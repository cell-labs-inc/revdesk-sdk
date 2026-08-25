# @revdesk/sdk

The official typed TypeScript client for the [RevDesk](https://revdesk.com) v1 API. Connect business
calling, messaging, phone-number operations, contacts, jobs, usage, and webhooks to the rest of your
revenue workflow with generated types and a bundled CLI.

[![npm](https://img.shields.io/npm/v/@revdesk/sdk)](https://www.npmjs.com/package/@revdesk/sdk)
[![agent skills](https://img.shields.io/badge/agent_skills-skills.sh-111827)](https://skills.sh/cell-labs-inc/revdesk-sdk)

[Developer platform](https://www.revdesk.com/developers) ·
[RevDesk API](https://www.revdesk.com/developers/api) ·
[Authentication](https://www.revdesk.com/developers/auth) ·
[Documentation](https://docs.revdesk.com/api-reference/sdks) ·
[npm package](https://www.npmjs.com/package/@revdesk/sdk) ·
[OpenAPI schema](https://www.revdesk.com/openapi.json) ·
[MCP server](https://www.revdesk.com/developers/mcp) ·
[CLI](https://www.revdesk.com/developers/cli) ·
[MCP registry listing](https://glama.ai/mcp/connectors/io.github.cell-labs-inc/revdesk-product)

## Install

```bash
npm install @revdesk/sdk
```

## Quickstart

```ts
import { RevDesk } from "@revdesk/sdk";

const revdesk = new RevDesk({ apiKey: process.env.REVDESK_API_KEY! });
await revdesk.calls.dial({ from_number: "+15551230000", to_number: "+15554560000" });
```

Full docs: **https://docs.revdesk.com/api-reference/sdks**

## CLI

The npm package includes the official `revdesk` command, so agents and developers can inspect the
API without writing an integration first:

```bash
npx @revdesk/sdk --help
npx @revdesk/sdk request GET '/v1/calls?limit=10'
```

## AI agents

This repository publishes installable agent skills, a portable
[Agent Plugin](https://agent-plugins.org/specification), MCP connection metadata, and a Codex plugin
alongside the SDK:

```bash
npx skills add cell-labs-inc/revdesk-sdk
```

The included skills teach agents how to discover the RevDesk API safely, choose least-privilege
scopes, use the SDK and CLI, and connect to the remote MCP server. Tool schemas are public; every
tool call and every organization-data request requires an organization-scoped API key.

## Browser calling

To place calls from the browser, use [`@revdesk/webrtc`](https://www.npmjs.com/package/@revdesk/webrtc)
(issue the call token with this SDK, then hand it to the browser client). See the
[calling guide](https://docs.revdesk.com/api-reference/calling-paths).

## Develop

This repo is a Bun workspace mirrored from RevDesk's monorepo.

```bash
bun install
bun run build       # ESM + CJS + .d.ts (via tsdown)
bun run type-check
```

The REST types are generated from RevDesk's OpenAPI spec.

Releases are published to npm from this public repository with GitHub OIDC trusted publishing and
automatic provenance; no long-lived npm publish token is stored in GitHub.

## License

[MIT](./LICENSE) © Cell Labs, Inc.

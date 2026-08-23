# @revdesk/sdk

The official typed TypeScript client for the [RevDesk](https://revdesk.com) v1 API — place calls and
texts, manage phone numbers and caller trust, read usage, and manage sub-entities.

[![npm](https://img.shields.io/npm/v/@revdesk/sdk)](https://www.npmjs.com/package/@revdesk/sdk)

[Documentation](https://docs.revdesk.com/api-reference/sdks) ·
[npm package](https://www.npmjs.com/package/@revdesk/sdk) ·
[OpenAPI schema](https://www.revdesk.com/openapi.json)

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

## License

[MIT](./LICENSE) © Cell Labs, Inc.

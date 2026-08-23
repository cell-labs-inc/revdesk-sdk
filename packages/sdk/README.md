# @revdesk/sdk

Official typed TypeScript client for the [RevDesk](https://revdesk.com) v1 API — phone numbers,
calls, SMS, caller IDs, caller trust, usage, and sub-entities. Types are generated directly from the
RevDesk OpenAPI spec, so request and response shapes always match the live API.

[![npm](https://img.shields.io/npm/v/@revdesk/sdk)](https://www.npmjs.com/package/@revdesk/sdk)

- [SDK documentation](https://docs.revdesk.com/api-reference/sdks)
- [Source on GitHub](https://github.com/cell-labs-inc/revdesk-sdk)
- [OpenAPI 3.1 schema](https://www.revdesk.com/openapi.json)

## Install

```bash
npm install @revdesk/sdk
# or: bun add @revdesk/sdk
```

Requires Node 18+ (uses the global `fetch`). Works in any modern runtime; pass a custom `fetch` if
your environment doesn't provide one.

## Quickstart

```ts
import { RevDesk } from "@revdesk/sdk";

const revdesk = new RevDesk({ apiKey: process.env.REVDESK_API_KEY! });

// List phone numbers
const { data: numbers } = await revdesk.phoneNumbers.list({ limit: 25 });

// Place an outbound call
await revdesk.calls.dial({ from_number: "+15551230000", to_number: "+15554560000" });

// Send an SMS
await revdesk.sms.send({ from: "+15551230000", to: "+15554560000", message: "Hi!" });
```

## CLI

The package also installs the `revdesk` command. Use it for scripts and one-off API calls without
writing a client:

```bash
export REVDESK_API_KEY="rv_…"
npx @revdesk/sdk request GET /v1/me
npx @revdesk/sdk request GET '/v1/calls?limit=10'
npx @revdesk/sdk request POST /v1/sms/send --data '{"from":"+14155550100","to":"+14155550101","message":"Hello"}'
```

Run `npx @revdesk/sdk --help` for the complete command reference. The CLI reads credentials only
from `REVDESK_API_KEY` and sends them in the `Authorization` header.

## AI agents

Every number you buy gets a RevDesk AI agent wired up to answer it automatically. List your agents,
read which number each answers, and capture an agent's `id` to steer calls:

```ts
// Discover your agents
const { data: agents } = await revdesk.agents.list();

// Point an outbound call at a specific agent
await revdesk.calls.create({ phoneNumber: "+15554560000", assistantId: agents[0].id });

// Reassign which agent answers an inbound number
await revdesk.phoneNumbers.update(phoneId, { agent_id: agents[0].id });

// Talk to an agent straight from the browser (pair with @revdesk/webrtc)
const { data: call } = await revdesk.agents.webCall(agents[0].id);
// → { token, room_url, … } → hand to RevDeskRoom
```

`listAll()` iterates every agent across all pages.

## Configuration

```ts
new RevDesk({
  apiKey: "…", // required
  baseUrl: "https://api.revdesk.com", // optional override
  fetch: customFetch, // optional fetch implementation
  headers: { "X-App": "my-app" }, // optional headers on every request
});
```

## Pagination

List endpoints that support cursors return `{ data, meta: { cursor } }`. Use `listAll()` to iterate
every page automatically:

```ts
for await (const number of revdesk.phoneNumbers.listAll()) {
  console.log(number.phone_number);
}
```

`listAll()` is available on `phoneNumbers`, `agents`, `subEntities`, and `callerTrust.reputation.numbers`.

## Idempotency

Mutating calls accept an `idempotencyKey` so a retried request is processed once. Use
`generateIdempotencyKey()` or supply your own:

```ts
import { generateIdempotencyKey } from "@revdesk/sdk";

await revdesk.sms.send(
  { from: "+15551230000", to: "+15554560000", message: "Hi!" },
  { idempotencyKey: generateIdempotencyKey() }
);
```

## Error handling

Every non-2xx response throws a `RevDeskError` with structured fields:

```ts
import { RevDeskError } from "@revdesk/sdk";

try {
  await revdesk.calls.dial({ from_number: "+1555…", to_number: "+1555…" });
} catch (err) {
  if (err instanceof RevDeskError) {
    console.error(err.code, err.status, err.message);
    if (err.fields) console.error("field errors:", err.fields);
    if (err.docUrl) console.error("see:", err.docUrl);
    if (err.isRetryable) {
      /* rate-limited or 5xx — safe to retry */
    }
  }
}
```

## Browser calling

To place calls from the browser, issue a token with this SDK and hand it to
[`@revdesk/webrtc`](https://www.npmjs.com/package/@revdesk/webrtc):

```ts
const { data } = await revdesk.webrtc.getToken({
  from_number: "+15551230000",
  to_number: "+15554560000",
});
// → pass data.token to `new RevDeskRTC({ token })` from @revdesk/webrtc
```

## License

MIT

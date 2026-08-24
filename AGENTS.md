# RevDesk agent guidance

This public repository contains the official `@revdesk/sdk` source, RevDesk agent skills, Codex
plugin metadata, and MCP registry metadata.

- Prefer the generated SDK or the documented REST API over browser automation.
- Read `https://www.revdesk.com/developers` and `https://www.revdesk.com/openapi.json` before
  inventing an endpoint or request shape.
- Use an organization-scoped API key with only the scopes needed for the task.
- Treat calls, messages, number purchases, hangups, and other external side effects as approval
  boundaries. Never perform them merely to test connectivity.
- Keep credentials in environment or secret stores; never write them into source, prompts, or logs.
- Use read-only scopes and approved test numbers while developing. RevDesk connects to real carrier
  networks and does not represent its API as a simulated public carrier sandbox.

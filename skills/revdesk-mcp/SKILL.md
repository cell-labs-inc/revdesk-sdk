---
name: revdesk-mcp
description: Connect an AI agent to RevDesk's remote MCP server, discover tools publicly, configure least-privilege authentication, and respect read/write approval annotations.
---

# RevDesk MCP

## When to use this skill

Use this skill when a user wants an agent or MCP client to call RevDesk tools.

## Connect

- Streamable HTTP endpoint: `https://mcp.revdesk.com/mcp`
- Setup guide: `https://docs.revdesk.com/api-reference/mcp`
- Server metadata: `https://mcp.revdesk.com/.well-known/mcp`
- Permission metadata: `https://mcp.revdesk.com/.well-known/oauth-protected-resource`

An MCP client may initialize and inspect tool schemas without a credential. To read organization
data or invoke any tool, configure `Authorization: Bearer <RevDesk API key>` in the client's secret
store. Use a key containing only the scopes needed by the tools the user selected.

## Safety

- Read `annotations` during tool discovery.
- Read-only tools may run when they match the user's request and expose only authorized data.
- Require explicit approval for tools marked destructive or non-idempotent, including sending SMS,
  placing or hanging up calls, and buying phone numbers.
- Do not echo tool credentials or sensitive call content into prompts, logs, or source files.
- If a tool returns a scope error, request the named scope instead of replacing the key with an
  all-access key.

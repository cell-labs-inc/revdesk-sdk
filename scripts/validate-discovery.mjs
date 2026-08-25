import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));

const plugin = await readJson("plugin.json");
const mcp = await readJson("mcp.json");
const packageManifest = await readJson("packages/sdk/package.json");
const cliCore = await readFile(new URL("../packages/sdk/src/cli-core.ts", import.meta.url), "utf8");
const apiSkill = await readFile(new URL("../skills/revdesk-api/SKILL.md", import.meta.url), "utf8");
const mcpSkill = await readFile(new URL("../skills/revdesk-mcp/SKILL.md", import.meta.url), "utf8");

if (plugin.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
  throw new Error("plugin.json must use the Agent Plugins 1.0 schema");
}
if (plugin.name !== "revdesk" || !plugin.description.includes("RevDesk")) {
  throw new Error("plugin.json must expose the canonical RevDesk identity");
}
if (mcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
  throw new Error("mcp.json must use the Agent Plugins MCP 1.0 schema");
}
if (mcp.mcpServers?.revdesk?.type !== "streamable-http") {
  throw new Error("mcp.json must advertise Streamable HTTP transport");
}
if (mcp.mcpServers?.revdesk?.url !== "https://mcp.revdesk.com/mcp") {
  throw new Error("mcp.json must advertise the canonical RevDesk MCP endpoint");
}
if (packageManifest.bin?.revdesk !== "dist/cli.js" || !packageManifest.keywords?.includes("cli")) {
  throw new Error("@revdesk/sdk must advertise the bundled revdesk CLI");
}
if (!cliCore.includes(`export const CLI_VERSION = "${packageManifest.version}"`)) {
  throw new Error("The revdesk CLI version must match @revdesk/sdk");
}
if (!apiSkill.includes("## When to use this skill") || !mcpSkill.includes("## When to use this skill")) {
  throw new Error("Published RevDesk skills must include explicit when-to-use guidance");
}

console.log("RevDesk Agent Plugin, MCP, and CLI discovery metadata is valid.");

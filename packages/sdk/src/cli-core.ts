export interface CliEnvironment {
  REVDESK_API_KEY?: string;
  REVDESK_API_URL?: string;
}

export interface CliIo {
  fetch: typeof fetch;
  stdout: (value: string) => void;
  stderr: (value: string) => void;
}

export const CLI_VERSION = "0.2.2";

export const CLI_HELP = `RevDesk CLI

Usage:
  revdesk request <METHOD> <PATH> [--data <JSON>] [--base-url <URL>]
  revdesk --help
  revdesk --version

Environment:
  REVDESK_API_KEY   Organization-scoped API key (required for requests)
  REVDESK_API_URL   API origin (default: https://api.revdesk.com)

Examples:
  revdesk request GET /v1/me
  revdesk request GET '/v1/calls?limit=10'
  revdesk request POST /v1/sms/send --data '{"from":"+14155550100","to":"+14155550101","message":"Hello"}'
`;

interface RequestCommand {
  kind: "request";
  method: string;
  path: string;
  data?: string;
  baseUrl?: string;
}

type CliCommand = { kind: "help" } | { kind: "version" } | RequestCommand;

export function parseCliArguments(argv: string[]): CliCommand {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) return { kind: "help" };
  if (argv.includes("--version") || argv.includes("-v")) return { kind: "version" };

  const [command, rawMethod, path, ...options] = argv;
  if (command !== "request" || !rawMethod || !path) {
    throw new Error("Expected: revdesk request <METHOD> <PATH>");
  }

  const method = rawMethod.toUpperCase();
  if (!new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]).has(method)) {
    throw new Error(`Unsupported HTTP method: ${rawMethod}`);
  }
  if (!path.startsWith("/v1/")) {
    throw new Error("PATH must begin with /v1/");
  }

  let data: string | undefined;
  let baseUrl: string | undefined;
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    const value = options[index + 1];
    if ((option === "--data" || option === "--base-url") && !value) {
      throw new Error(`${option} requires a value`);
    }
    if (option === "--data") {
      data = value;
      index += 1;
      continue;
    }
    if (option === "--base-url") {
      baseUrl = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${option}`);
  }

  if (data) JSON.parse(data);
  return { kind: "request", method, path, data, baseUrl };
}

export async function runCli(argv: string[], environment: CliEnvironment, io: CliIo): Promise<number> {
  let command: CliCommand;
  try {
    command = parseCliArguments(argv);
  } catch (error) {
    io.stderr(error instanceof Error ? error.message : String(error));
    return 2;
  }

  if (command.kind === "help") {
    io.stdout(CLI_HELP.trimEnd());
    return 0;
  }
  if (command.kind === "version") {
    io.stdout(CLI_VERSION);
    return 0;
  }

  const apiKey = environment.REVDESK_API_KEY;
  if (!apiKey) {
    io.stderr("REVDESK_API_KEY is required. Create a least-privilege key in Settings → API Keys.");
    return 2;
  }

  const baseUrl = (command.baseUrl ?? environment.REVDESK_API_URL ?? "https://api.revdesk.com").replace(
    /\/$/,
    ""
  );
  let response: Response;
  try {
    response = await io.fetch(`${baseUrl}${command.path}`, {
      method: command.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        ...(command.data ? { "Content-Type": "application/json" } : {}),
      },
      ...(command.data ? { body: command.data } : {}),
    });
  } catch (error) {
    io.stderr(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }

  const body = await response.text();
  io.stdout(formatResponseBody(body));
  if (!response.ok) {
    io.stderr(`RevDesk API returned HTTP ${response.status}`);
    return 1;
  }
  return 0;
}

function formatResponseBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

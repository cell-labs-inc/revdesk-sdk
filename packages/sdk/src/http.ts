import { type ErrorEnvelope, RevDeskError } from "./errors";

export interface HttpClientOptions {
  /** Your RevDesk API key. Sent as a Bearer token on every request. */
  apiKey: string;
  /** API origin. Defaults to `https://api.revdesk.com`. */
  baseUrl?: string;
  /** Custom `fetch` implementation (defaults to the global `fetch`). */
  fetch?: typeof fetch;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
}

export interface RequestInitOptions<TQuery = unknown, TBody = unknown> {
  query?: TQuery;
  body?: TBody;
  /** Sent as the `Idempotency-Key` header; safe to retry the request verbatim. */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

const DEFAULT_BASE_URL = "https://api.revdesk.com";

/** Generate a random idempotency key. */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

function buildUrl(baseUrl: string, path: string, query?: unknown): string {
  const url = new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (query && typeof query === "object") {
    for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(key, String(v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** Thin typed fetch wrapper: Bearer auth, JSON in/out, error-envelope decoding. */
export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly extraHeaders: Record<string, string>;

  constructor(options: HttpClientOptions) {
    if (!options.apiKey) {
      throw new Error("RevDesk: an `apiKey` is required.");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.extraHeaders = options.headers ?? {};
    const resolvedFetch = options.fetch ?? globalThis.fetch;
    if (!resolvedFetch) {
      throw new Error("RevDesk: no global `fetch` found — pass one via `fetch` in the options.");
    }
    this.fetchImpl = resolvedFetch.bind(globalThis);
  }

  async request<TResponse, TQuery = unknown, TBody = unknown>(
    method: string,
    path: string,
    init: RequestInitOptions<TQuery, TBody> = {},
  ): Promise<TResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      ...this.extraHeaders,
    };
    if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;

    const hasBody = init.body !== undefined && method !== "GET" && method !== "DELETE";
    if (hasBody) headers["Content-Type"] = "application/json";

    const response = await this.fetchImpl(buildUrl(this.baseUrl, path, init.query), {
      method,
      headers,
      body: hasBody ? JSON.stringify(init.body) : undefined,
      signal: init.signal,
    });

    const requestId = response.headers.get("x-request-id") ?? undefined;
    const text = await response.text();
    const payload: unknown = text ? safeJsonParse(text) : undefined;

    if (!response.ok) {
      throw toRevDeskError(response.status, payload, requestId);
    }

    return payload as TResponse;
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function toRevDeskError(status: number, payload: unknown, requestId?: string): RevDeskError {
  const envelope = (payload as ErrorEnvelope | undefined)?.error;
  return new RevDeskError({
    status,
    code: envelope?.code ?? `http_${status}`,
    message: envelope?.message ?? `RevDesk API request failed with status ${status}.`,
    category: envelope?.category,
    fields: envelope?.fields,
    docUrl: envelope?.doc_url,
    requestId,
  });
}

/**
 * Walk a cursor-paginated list endpoint, yielding every item across all pages.
 * `fetchPage` is called once per page with the next cursor threaded in; the item
 * type is inferred from its return value.
 */
export async function* paginate<TItem>(
  fetchPage: (
    cursor: string | undefined,
  ) => Promise<{ data: TItem[]; meta?: { cursor?: string } }>,
  startCursor?: string,
): AsyncGenerator<TItem, void, unknown> {
  let cursor = startCursor;
  do {
    const page = await fetchPage(cursor);
    for (const item of page.data) yield item;
    cursor = page.meta?.cursor;
  } while (cursor);
}

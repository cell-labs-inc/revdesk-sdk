/** The error envelope returned by the RevDesk v1 API on any non-2xx response. */
export interface ErrorEnvelope {
  error?: {
    code: string;
    category?: string;
    message: string;
    fields?: Record<string, string>;
    doc_url?: string;
  };
}

export interface RevDeskErrorInit {
  code: string;
  message: string;
  status: number;
  category?: string;
  fields?: Record<string, string>;
  docUrl?: string;
  requestId?: string;
}

/**
 * Thrown for every non-2xx API response. Carries the structured fields from the
 * RevDesk error envelope so callers can branch on `code` / `status` rather than
 * parsing message strings.
 */
export class RevDeskError extends Error {
  /** Machine-readable error code, e.g. `"validation_error"`, `"rate_limited"`. */
  readonly code: string;
  /** HTTP status code. */
  readonly status: number;
  /** Coarse bucket for call-failure codes, when present. */
  readonly category?: string;
  /** Per-field validation messages, when present. */
  readonly fields?: Record<string, string>;
  /** Link to the relevant documentation, when present. */
  readonly docUrl?: string;
  /** Server request id, echoed for support/debugging when present. */
  readonly requestId?: string;

  constructor(init: RevDeskErrorInit) {
    super(init.message);
    this.name = "RevDeskError";
    this.code = init.code;
    this.status = init.status;
    this.category = init.category;
    this.fields = init.fields;
    this.docUrl = init.docUrl;
    this.requestId = init.requestId;
    Object.setPrototypeOf(this, RevDeskError.prototype);
  }

  /** True for transient failures worth retrying (rate limits, 5xx). */
  get isRetryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

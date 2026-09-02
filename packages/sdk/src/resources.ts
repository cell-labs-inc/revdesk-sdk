import { type HttpClient, paginate } from "./http";
import type { ItemOf, QueryOf, RequestBodyOf, SuccessOf } from "./types";

/** Options accepted by mutating (POST/PATCH/PUT/DELETE) calls. */
export interface MutationOptions {
  /** Sent as `Idempotency-Key`; replaying the same key returns the first result. */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

const enc = encodeURIComponent;

abstract class Resource {
  constructor(protected readonly http: HttpClient) {}
}

export class PhoneNumbersResource extends Resource {
  /** List phone numbers in your workspace (one page). */
  list(query?: Partial<QueryOf<"v1_phone_numbers_get">>): Promise<SuccessOf<"v1_phone_numbers_get">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_get">>("GET", "/v1/phone-numbers", {
      query: { limit: 50, ...query },
    });
  }

  /** Iterate every phone number across all pages. */
  listAll(query?: Partial<QueryOf<"v1_phone_numbers_get">>): AsyncGenerator<ItemOf<"v1_phone_numbers_get">, void, unknown> {
    return paginate((cursor) => this.list({ limit: 100, ...query, cursor }));
  }

  /** Search for purchasable phone numbers. */
  search(query: QueryOf<"v1_phone_numbers_search_get">): Promise<SuccessOf<"v1_phone_numbers_search_get">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_search_get">>("GET", "/v1/phone-numbers/search", {
      query,
    });
  }

  /** Retrieve a single phone number. */
  get(id: string): Promise<SuccessOf<"v1_phone_numbers_id_get">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_id_get">>("GET", `/v1/phone-numbers/${enc(id)}`);
  }

  /** Purchase a phone number. */
  buy(body: RequestBodyOf<"v1_phone_numbers_post">, options?: MutationOptions): Promise<SuccessOf<"v1_phone_numbers_post">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_post">>("POST", "/v1/phone-numbers", {
      body,
      ...options,
    });
  }

  /** Update a phone number's configuration. */
  update(id: string, body: RequestBodyOf<"v1_phone_numbers_id_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_phone_numbers_id_patch">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_id_patch">>(
      "PATCH",
      `/v1/phone-numbers/${enc(id)}`,
      { body, ...options }
    );
  }

  /** Release a phone number. */
  release(id: string, options?: MutationOptions): Promise<SuccessOf<"v1_phone_numbers_id_delete">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_id_delete">>(
      "DELETE",
      `/v1/phone-numbers/${enc(id)}`,
      { ...options }
    );
  }

  /** Check the CNAM (caller-name) registration status of a number. */
  cnamStatus(id: string): Promise<SuccessOf<"v1_phone_numbers_id_cnam_status_get">> {
    return this.http.request<SuccessOf<"v1_phone_numbers_id_cnam_status_get">>(
      "GET",
      `/v1/phone-numbers/${enc(id)}/cnam-status`
    );
  }
}

export class CallerIdsResource extends Resource {
  /** List verified caller IDs. */
  list(query?: QueryOf<"v1_caller_ids_get">): Promise<SuccessOf<"v1_caller_ids_get">> {
    return this.http.request<SuccessOf<"v1_caller_ids_get">>("GET", "/v1/caller-ids", { query });
  }

  /** Register a new caller ID (begins verification). */
  create(body: RequestBodyOf<"v1_caller_ids_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_ids_post">> {
    return this.http.request<SuccessOf<"v1_caller_ids_post">>("POST", "/v1/caller-ids", {
      body,
      ...options,
    });
  }

  /** Update a caller ID. */
  update(id: string, body: RequestBodyOf<"v1_caller_ids_id_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_ids_id_patch">> {
    return this.http.request<SuccessOf<"v1_caller_ids_id_patch">>("PATCH", `/v1/caller-ids/${enc(id)}`, {
      body,
      ...options,
    });
  }

  /** Submit the verification code for a caller ID. */
  verify(id: string, body: RequestBodyOf<"v1_caller_ids_id_verify_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_ids_id_verify_post">> {
    return this.http.request<SuccessOf<"v1_caller_ids_id_verify_post">>(
      "POST",
      `/v1/caller-ids/${enc(id)}/verify`,
      { body, ...options }
    );
  }
}

export class CallsResource extends Resource {
  /** List calls. */
  list(query?: QueryOf<"v1_calls_get">): Promise<SuccessOf<"v1_calls_get">> {
    return this.http.request<SuccessOf<"v1_calls_get">>("GET", "/v1/calls", { query });
  }

  /** Retrieve a single call. */
  get(id: string): Promise<SuccessOf<"v1_calls_id_get">> {
    return this.http.request<SuccessOf<"v1_calls_id_get">>("GET", `/v1/calls/${enc(id)}`);
  }

  /** Create a call. */
  create(body: RequestBodyOf<"v1_calls_post">, options?: MutationOptions): Promise<SuccessOf<"v1_calls_post">> {
    return this.http.request<SuccessOf<"v1_calls_post">>("POST", "/v1/calls", { body, ...options });
  }

  /** Place an outbound call. */
  dial(body: RequestBodyOf<"v1_calls_dial_post">, options?: MutationOptions): Promise<SuccessOf<"v1_calls_dial_post">> {
    return this.http.request<SuccessOf<"v1_calls_dial_post">>("POST", "/v1/calls/dial", {
      body,
      ...options,
    });
  }

  /** Hang up an in-progress call. */
  hangup(id: string, options?: MutationOptions): Promise<SuccessOf<"v1_calls_id_hangup_post">> {
    return this.http.request<SuccessOf<"v1_calls_id_hangup_post">>("POST", `/v1/calls/${enc(id)}/hangup`, {
      ...options,
    });
  }

  /** Save what a recipient handset displayed for a dedicated spam-label test call. */
  recordTestResult(
    id: string,
    body: RequestBodyOf<"v1_calls_id_test_result_patch">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_calls_id_test_result_patch">> {
    return this.http.request<SuccessOf<"v1_calls_id_test_result_patch">>(
      "PATCH",
      `/v1/calls/${enc(id)}/test-result`,
      { body, ...options }
    );
  }
}

/**
 * Your RevDesk AI agents — the runtime AI that answers inbound calls and powers
 * outbound campaigns. Every number you buy gets one wired up automatically; use
 * this resource to discover them, capture an agent `id` for `calls.create`, or
 * start a browser call with `webCall`.
 */
export class AgentsResource extends Resource {
  /** List AI agents in your organization (one page). */
  list(query?: Partial<QueryOf<"v1_agents_get">>): Promise<SuccessOf<"v1_agents_get">> {
    return this.http.request<SuccessOf<"v1_agents_get">>("GET", "/v1/agents", {
      query: { limit: 50, ...query },
    });
  }

  /** Iterate every AI agent across all pages. */
  listAll(query?: Partial<QueryOf<"v1_agents_get">>): AsyncGenerator<ItemOf<"v1_agents_get">, void, unknown> {
    return paginate((cursor) => this.list({ limit: 100, ...query, cursor }));
  }

  /** Retrieve a single AI agent, including its system prompt. */
  get(id: string): Promise<SuccessOf<"v1_agents_id_get">> {
    return this.http.request<SuccessOf<"v1_agents_id_get">>("GET", `/v1/agents/${enc(id)}`);
  }

  /** Configure an agent — name, greeting, system prompt, voice, language, enabled. */
  update(id: string, body: RequestBodyOf<"v1_agents_id_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_agents_id_patch">> {
    return this.http.request<SuccessOf<"v1_agents_id_patch">>("PATCH", `/v1/agents/${enc(id)}`, {
      body,
      ...options,
    });
  }

  /**
   * Start a browser call with this agent. Returns a join token + room URL —
   * hand them to `@revdesk/webrtc`'s `RevDeskRoom` to talk to the agent in the
   * browser, no phone number required.
   */
  webCall(id: string, options?: MutationOptions): Promise<SuccessOf<"v1_agents_id_web_call_post">> {
    return this.http.request<SuccessOf<"v1_agents_id_web_call_post">>(
      "POST",
      `/v1/agents/${enc(id)}/web-call`,
      { ...options }
    );
  }
}

export class SmsResource extends Resource {
  /** Send an SMS message. */
  send(body: RequestBodyOf<"v1_sms_send_post">, options?: MutationOptions): Promise<SuccessOf<"v1_sms_send_post">> {
    return this.http.request<SuccessOf<"v1_sms_send_post">>("POST", "/v1/sms/send", {
      body,
      ...options,
    });
  }
}

export class UsageResource extends Resource {
  /** Workspace-wide usage summary. */
  get(query?: QueryOf<"v1_usage_get">): Promise<SuccessOf<"v1_usage_get">> {
    return this.http.request<SuccessOf<"v1_usage_get">>("GET", "/v1/usage", { query });
  }

  /** Usage for a single phone number. */
  getForNumber(phoneId: string): Promise<SuccessOf<"v1_usage_phoneId_get">> {
    return this.http.request<SuccessOf<"v1_usage_phoneId_get">>("GET", `/v1/usage/${enc(phoneId)}`);
  }
}

export class SubEntitiesResource extends Resource {
  /** List sub-entities (child workspaces), one page. */
  list(query?: Partial<QueryOf<"v1_sub_entities_get">>): Promise<SuccessOf<"v1_sub_entities_get">> {
    return this.http.request<SuccessOf<"v1_sub_entities_get">>("GET", "/v1/sub-entities", {
      query: { limit: 50, ...query },
    });
  }

  /** Iterate every sub-entity across all pages. */
  listAll(query?: Partial<QueryOf<"v1_sub_entities_get">>): AsyncGenerator<ItemOf<"v1_sub_entities_get">, void, unknown> {
    return paginate((cursor) => this.list({ limit: 100, ...query, cursor }));
  }

  /** Create a sub-entity. */
  create(body: RequestBodyOf<"v1_sub_entities_post">, options?: MutationOptions): Promise<SuccessOf<"v1_sub_entities_post">> {
    return this.http.request<SuccessOf<"v1_sub_entities_post">>("POST", "/v1/sub-entities", {
      body,
      ...options,
    });
  }

  /** Retrieve a sub-entity. */
  get(id: string): Promise<SuccessOf<"v1_sub_entities_id_get">> {
    return this.http.request<SuccessOf<"v1_sub_entities_id_get">>("GET", `/v1/sub-entities/${enc(id)}`);
  }

  /** Update a sub-entity. */
  update(id: string, body: RequestBodyOf<"v1_sub_entities_id_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_sub_entities_id_patch">> {
    return this.http.request<SuccessOf<"v1_sub_entities_id_patch">>("PATCH", `/v1/sub-entities/${enc(id)}`, {
      body,
      ...options,
    });
  }
}

class ReputationNumbersResource extends Resource {
  list(query?: Partial<QueryOf<"v1_caller_trust_reputation_numbers_get">>): Promise<SuccessOf<"v1_caller_trust_reputation_numbers_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_numbers_get">>(
      "GET",
      "/v1/caller-trust/reputation/numbers",
      { query: { limit: 50, ...query } }
    );
  }

  /** Iterate every reputation-monitored number across all pages. */
  listAll(query?: Partial<QueryOf<"v1_caller_trust_reputation_numbers_get">>): AsyncGenerator<ItemOf<"v1_caller_trust_reputation_numbers_get">, void, unknown> {
    return paginate((cursor) => this.list({ limit: 100, ...query, cursor }));
  }

  add(body: RequestBodyOf<"v1_caller_trust_reputation_numbers_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_reputation_numbers_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_numbers_post">>(
      "POST",
      "/v1/caller-trust/reputation/numbers",
      { body, ...options }
    );
  }

  get(phone: string): Promise<SuccessOf<"v1_caller_trust_reputation_numbers_phone_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_numbers_phone_get">>(
      "GET",
      `/v1/caller-trust/reputation/numbers/${enc(phone)}`
    );
  }

  remove(phone: string, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_reputation_numbers_phone_delete">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_numbers_phone_delete">>(
      "DELETE",
      `/v1/caller-trust/reputation/numbers/${enc(phone)}`,
      { ...options }
    );
  }
}

class EnterpriseResource extends Resource {
  get(): Promise<SuccessOf<"v1_caller_trust_enterprise_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_get">>(
      "GET",
      "/v1/caller-trust/enterprise"
    );
  }

  create(body: RequestBodyOf<"v1_caller_trust_enterprise_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_post">>(
      "POST",
      "/v1/caller-trust/enterprise",
      { body, ...options }
    );
  }

  delete(options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_delete">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_delete">>(
      "DELETE",
      "/v1/caller-trust/enterprise",
      { ...options }
    );
  }

  submit(options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_submit_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_submit_post">>(
      "POST",
      "/v1/caller-trust/enterprise/submit",
      { ...options }
    );
  }

  signAndSubmit(
    body: RequestBodyOf<"v1_caller_trust_enterprise_sign_and_submit_post">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_caller_trust_enterprise_sign_and_submit_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_sign_and_submit_post">>(
      "POST",
      "/v1/caller-trust/enterprise/sign-and-submit",
      { body, ...options }
    );
  }

  resign(body: RequestBodyOf<"v1_caller_trust_enterprise_resign_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_resign_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_resign_post">>(
      "POST",
      "/v1/caller-trust/enterprise/resign",
      { body, ...options }
    );
  }

  generateLoa(
    body: RequestBodyOf<"v1_caller_trust_enterprise_generate_loa_post">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_caller_trust_enterprise_generate_loa_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_generate_loa_post">>(
      "POST",
      "/v1/caller-trust/enterprise/generate-loa",
      { body, ...options }
    );
  }

  // ── Id-addressed variants (the rare multi-registration case) ─────────
  // The bare methods above act on the caller's (primary) enterprise; these
  // address a specific registration by its `id`.

  /** Fetch a specific enterprise registration by ID. */
  retrieve(id: string): Promise<SuccessOf<"v1_caller_trust_enterprise_id_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_get">>(
      "GET",
      `/v1/caller-trust/enterprise/${enc(id)}`
    );
  }

  /** Update fields on a specific DRAFT enterprise registration. */
  update(id: string, body: RequestBodyOf<"v1_caller_trust_enterprise_id_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_id_patch">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_patch">>(
      "PATCH",
      `/v1/caller-trust/enterprise/${enc(id)}`,
      { body, ...options }
    );
  }

  /** Delete a specific enterprise registration by ID. */
  deleteById(id: string, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_id_delete">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_delete">>(
      "DELETE",
      `/v1/caller-trust/enterprise/${enc(id)}`,
      { ...options }
    );
  }

  /** Submit a specific DRAFT enterprise to the carrier by ID. */
  submitById(id: string, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_enterprise_id_submit_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_submit_post">>(
      "POST",
      `/v1/caller-trust/enterprise/${enc(id)}/submit`,
      { ...options }
    );
  }

  /** Sign the LOA + submit a specific DRAFT enterprise to the carrier by ID. */
  signAndSubmitById(
    id: string,
    body: RequestBodyOf<"v1_caller_trust_enterprise_id_sign_and_submit_post">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_caller_trust_enterprise_id_sign_and_submit_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_sign_and_submit_post">>(
      "POST",
      `/v1/caller-trust/enterprise/${enc(id)}/sign-and-submit`,
      { body, ...options }
    );
  }

  /** Re-sign the LOA for a specific enterprise by ID. */
  resignById(
    id: string,
    body: RequestBodyOf<"v1_caller_trust_enterprise_id_resign_post">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_caller_trust_enterprise_id_resign_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_resign_post">>(
      "POST",
      `/v1/caller-trust/enterprise/${enc(id)}/resign`,
      { body, ...options }
    );
  }

  /** Generate the hand-signing LOA PDF for a specific enterprise by ID. */
  generateLoaById(
    id: string,
    body: RequestBodyOf<"v1_caller_trust_enterprise_id_generate_loa_post">,
    options?: MutationOptions
  ): Promise<SuccessOf<"v1_caller_trust_enterprise_id_generate_loa_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_enterprise_id_generate_loa_post">>(
      "POST",
      `/v1/caller-trust/enterprise/${enc(id)}/generate-loa`,
      { body, ...options }
    );
  }
}

class BrandResource extends Resource {
  get(): Promise<SuccessOf<"v1_caller_trust_brand_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_brand_get">>("GET", "/v1/caller-trust/brand");
  }

  update(body: RequestBodyOf<"v1_caller_trust_brand_put">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_brand_put">> {
    return this.http.request<SuccessOf<"v1_caller_trust_brand_put">>("PUT", "/v1/caller-trust/brand", {
      body,
      ...options,
    });
  }

  submit(options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_brand_submit_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_brand_submit_post">>(
      "POST",
      "/v1/caller-trust/brand/submit",
      { ...options }
    );
  }
}

class DocumentsResource extends Resource {
  create(body: RequestBodyOf<"v1_caller_trust_documents_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_documents_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_documents_post">>(
      "POST",
      "/v1/caller-trust/documents",
      { body, ...options }
    );
  }

  get(id: string): Promise<SuccessOf<"v1_caller_trust_documents_id_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_documents_id_get">>(
      "GET",
      `/v1/caller-trust/documents/${enc(id)}`
    );
  }
}

class ReputationResource extends Resource {
  /** Numbers enrolled in reputation monitoring. */
  readonly numbers: ReputationNumbersResource;

  constructor(http: HttpClient) {
    super(http);
    this.numbers = new ReputationNumbersResource(http);
  }

  get(query?: QueryOf<"v1_caller_trust_reputation_get">): Promise<SuccessOf<"v1_caller_trust_reputation_get">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_get">>(
      "GET",
      "/v1/caller-trust/reputation",
      { query }
    );
  }

  enroll(body: RequestBodyOf<"v1_caller_trust_reputation_post">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_reputation_post">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_post">>(
      "POST",
      "/v1/caller-trust/reputation",
      { body, ...options }
    );
  }

  update(body: RequestBodyOf<"v1_caller_trust_reputation_patch">, options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_reputation_patch">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_patch">>(
      "PATCH",
      "/v1/caller-trust/reputation",
      { body, ...options }
    );
  }

  delete(options?: MutationOptions): Promise<SuccessOf<"v1_caller_trust_reputation_delete">> {
    return this.http.request<SuccessOf<"v1_caller_trust_reputation_delete">>(
      "DELETE",
      "/v1/caller-trust/reputation",
      { ...options }
    );
  }
}

/** Caller-trust APIs: enterprise registration, branded calling, reputation, documents. */
export class CallerTrustResource extends Resource {
  readonly enterprise: EnterpriseResource;
  readonly brand: BrandResource;
  readonly reputation: ReputationResource;
  readonly documents: DocumentsResource;

  constructor(http: HttpClient) {
    super(http);
    this.enterprise = new EnterpriseResource(http);
    this.brand = new BrandResource(http);
    this.reputation = new ReputationResource(http);
    this.documents = new DocumentsResource(http);
  }
}

export class AccountResource extends Resource {
  /** Retrieve account/billing details. */
  get(): Promise<SuccessOf<"v1_account_get">> {
    return this.http.request<SuccessOf<"v1_account_get">>("GET", "/v1/account");
  }
}

export class MeResource extends Resource {
  /** Introspect the current API key (owner, organization, scopes). */
  get(): Promise<SuccessOf<"v1_me_get">> {
    return this.http.request<SuccessOf<"v1_me_get">>("GET", "/v1/me");
  }
}

/**
 * Token issuance for browser calling. Pair these with `@revdesk/webrtc`:
 * `getToken` feeds `RevDeskRTC` (browser-direct) and `getRoomToken` feeds
 * `RevDeskRoom` (relay).
 */
export class WebrtcResource extends Resource {
  /** Issue a single-call token for browser-direct calling. */
  getToken(body: RequestBodyOf<"v1_webrtc_token_post">, options?: MutationOptions): Promise<SuccessOf<"v1_webrtc_token_post">> {
    return this.http.request<SuccessOf<"v1_webrtc_token_post">>("POST", "/v1/webrtc-token", {
      body,
      ...options,
    });
  }

  /** Issue a room-join token for relay calling. */
  getRoomToken(body: RequestBodyOf<"v1_room_token_post">, options?: MutationOptions): Promise<SuccessOf<"v1_room_token_post">> {
    return this.http.request<SuccessOf<"v1_room_token_post">>("POST", "/v1/room-token", {
      body,
      ...options,
    });
  }
}

/**
 * Bounded client tokens. Call `create` on your SERVER (with your API key) to mint
 * a short-lived `rdc_…` token restricted to specific from/to numbers, then hand
 * that token to an untrusted client app. Construct a `RevDesk` client (or the
 * `@revdesk/webrtc` SDK) with the minted token in place of the API key — it is
 * sent on the same `Authorization: Bearer` header and can only call within bounds.
 */
export class ClientTokensResource extends Resource {
  /** Mint a downscoped, number-bounded client token. Server-side only. */
  create(body: RequestBodyOf<"v1_client_tokens_post">, options?: MutationOptions): Promise<SuccessOf<"v1_client_tokens_post">> {
    return this.http.request<SuccessOf<"v1_client_tokens_post">>("POST", "/v1/client-tokens", {
      body,
      ...options,
    });
  }
}

import type { operations } from "./generated/openapi";

/**
 * Type helpers that derive request/response/parameter shapes straight from the
 * generated OpenAPI `operations`. The hand-written client never restates a
 * response shape — it references these, so the spec is the single source of
 * truth and the types can never drift from the live API.
 */

export type { operations };

/** All defined operation ids (e.g. `"v1_phone_numbers_get"`). */
export type OperationId = keyof operations;

type JsonOf<T> = T extends { content: { "application/json": infer B } } ? B : never;

/** The `application/json` body of an operation's 2xx (always 200 in this API) response. */
export type SuccessOf<O extends OperationId> = operations[O]["responses"] extends {
  200: infer R;
}
  ? JsonOf<R>
  : never;

/** The `application/json` request body of an operation, or `never` if it takes none. */
export type RequestBodyOf<O extends OperationId> = operations[O] extends {
  requestBody: { content: { "application/json": infer B } };
}
  ? B
  : operations[O] extends { requestBody?: { content: { "application/json": infer B } } }
    ? B | undefined
    : never;

type Params<O extends OperationId> = operations[O] extends { parameters: infer P } ? P : never;

/** The query parameters of an operation (`never` when it accepts none). */
export type QueryOf<O extends OperationId> = Params<O> extends { query?: infer Q } ? Q : never;

/** A cursor-paginated list envelope as returned by the v1 list endpoints. */
export interface ListEnvelope<TItem> {
  data: TItem[];
  meta: {
    cursor?: string;
    total_results?: number;
    page_size?: number;
  };
}

/** The element type of a list operation's `data` array. */
export type ItemOf<O extends OperationId> = SuccessOf<O> extends { data: ReadonlyArray<infer T> } ? T : never;

import { describe, expect, it, vi } from "vitest";

import { HttpClient } from "./http";

describe("HttpClient error envelopes", () => {
  it("exposes API resolution guidance on RevDeskError", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "route_not_found",
            message: "No operation matches this path",
            resolution_hint: "Use a path listed in the OpenAPI document.",
            doc_url: "https://docs.revdesk.com/api-reference/introduction",
          },
        }),
        { status: 404, headers: { "x-request-id": "req_123" } }
      )
    );
    const client = new HttpClient({ apiKey: "rv_test", fetch: fetchMock });

    await expect(client.request("GET", "/v1/does-not-exist")).rejects.toMatchObject({
      name: "RevDeskError",
      code: "route_not_found",
      status: 404,
      resolutionHint: "Use a path listed in the OpenAPI document.",
      docUrl: "https://docs.revdesk.com/api-reference/introduction",
      requestId: "req_123",
    });
  });
});

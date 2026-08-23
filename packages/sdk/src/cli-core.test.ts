import { describe, expect, it, vi } from "vitest";

import { parseCliArguments, runCli } from "./cli-core";

describe("RevDesk CLI", () => {
  it("parses a typed API request", () => {
    expect(parseCliArguments(["request", "post", "/v1/sms/send", "--data", '{"message":"hello"}'])).toEqual({
      kind: "request",
      method: "POST",
      path: "/v1/sms/send",
      data: '{"message":"hello"}',
    });
  });

  it("sends the API key only in the Authorization header and prints formatted JSON", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "call_123" } }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      })
    );
    const stdout = vi.fn();
    const stderr = vi.fn();

    const exitCode = await runCli(
      ["request", "POST", "/v1/calls/dial", "--data", '{"to_number":"+14155550100"}'],
      { REVDESK_API_KEY: "rv_test_secret" },
      { fetch: fetchMock, stdout, stderr }
    );

    expect(exitCode).toBe(0);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.revdesk.com/v1/calls/dial",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer rv_test_secret" }),
      })
    );
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining('"call_123"'));
    expect(stderr).not.toHaveBeenCalled();
  });

  it("requires an API key before making a request", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const stderr = vi.fn();

    const exitCode = await runCli(
      ["request", "GET", "/v1/me"],
      {},
      {
        fetch: fetchMock,
        stdout: vi.fn(),
        stderr,
      }
    );

    expect(exitCode).toBe(2);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("REVDESK_API_KEY"));
  });
});

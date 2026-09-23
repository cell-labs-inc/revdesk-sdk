import { describe, expect, it, mock } from "bun:test";

import { CLI_VERSION, parseCliArguments, runCli } from "./cli-core";

describe("RevDesk CLI", () => {
  it("reports the published package version", async () => {
    const stdout = mock();

    expect(await runCli(["--version"], {}, { fetch: mock<typeof fetch>() as unknown as typeof fetch, stdout, stderr: mock() })).toBe(
      0
    );
    expect(CLI_VERSION).toBe("0.2.2");
    expect(stdout).toHaveBeenCalledWith("0.2.2");
  });

  it("parses a typed API request", () => {
    expect(parseCliArguments(["request", "post", "/v1/sms/send", "--data", '{"message":"hello"}'])).toEqual({
      kind: "request",
      method: "POST",
      path: "/v1/sms/send",
      data: '{"message":"hello"}',
    });
  });

  it("sends the API key only in the Authorization header and prints formatted JSON", async () => {
    const fetchMock = mock<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "call_123" } }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      })
    );
    const stdout = mock();
    const stderr = mock();

    const exitCode = await runCli(
      ["request", "POST", "/v1/calls/dial", "--data", '{"to_number":"+14155550100"}'],
      { REVDESK_API_KEY: "rv_test_secret" },
      { fetch: fetchMock as unknown as typeof fetch, stdout, stderr }
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
    const fetchMock = mock<typeof fetch>();
    const stderr = mock();

    const exitCode = await runCli(
      ["request", "GET", "/v1/me"],
      {},
      {
        fetch: fetchMock as unknown as typeof fetch,
        stdout: mock(),
        stderr,
      }
    );

    expect(exitCode).toBe(2);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("REVDESK_API_KEY"));
  });
});

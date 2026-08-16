import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/support/route";

describe("POST /api/support", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });
  it("rejects invalid JSON payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "10.1.1.1",
        },
        body: "{invalid",
      }) as any
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Invalid JSON payload",
    });
  });

  it("accepts honeypot submissions as success", async () => {
    const response = await POST(
      new Request("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "10.1.1.2",
        },
        body: JSON.stringify({ honeypot: "bot" }),
      }) as any
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("validates required fields", async () => {
    const response = await POST(
      new Request("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "10.1.1.3",
        },
        body: JSON.stringify({
          values: { email: "" },
          fields: [{ name: "email", label: "Email", type: "email", required: true }],
        }),
      }) as any
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Missing required field: Email",
    });
  });

  it("does not claim delivery when no support webhook is configured", async () => {
    const response = await POST(
      new Request("http://localhost/api/support", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.1.1.9" },
        body: JSON.stringify({
          values: { email: "user@example.com" },
          fields: [{ name: "email", label: "Email", type: "email", required: true }],
        }),
      }) as any
    );

    expect(response.status).toBe(503);
  });

  it("rate limits repeated submissions from same client", async () => {
    vi.stubEnv("SUPPORT_WEBHOOK_URL", "https://example.test/support");
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 202 }));
    const makeRequest = () =>
      POST(
        new Request("http://localhost/api/support", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "10.1.1.4",
          },
          body: JSON.stringify({
            values: { email: "user@example.com" },
            fields: [{ name: "email", label: "Email", type: "email", required: true }],
          }),
        }) as any
      );

    for (let i = 0; i < 5; i += 1) {
      const ok = await makeRequest();
      expect(ok.status).toBe(200);
    }

    const blocked = await makeRequest();
    expect(blocked.status).toBe(429);
    await expect(blocked.json()).resolves.toEqual({
      success: false,
      error: "Too many requests. Please try again shortly.",
    });
  });
});

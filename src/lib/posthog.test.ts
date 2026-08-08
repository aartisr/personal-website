import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPostHogConfig,
  postHogEnabledEnvVar,
  postHogHostEnvVar,
  postHogProjectTokenEnvVar,
  serializeForInlineScript,
} from "@/lib/posthog";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("PostHog config", () => {
  it("stays disabled until a project token is configured", () => {
    vi.stubEnv(postHogProjectTokenEnvVar, "");

    expect(getPostHogConfig()).toBeNull();
  });

  it("uses the cloud ingestion host when only a token is configured", () => {
    vi.stubEnv(postHogProjectTokenEnvVar, "  phc_test  ");
    vi.stubEnv(postHogHostEnvVar, "");

    expect(getPostHogConfig()).toEqual({
      projectToken: "phc_test",
      host: "https://us.i.posthog.com",
    });
  });

  it("normalizes a configured cloud or self-hosted ingestion host", () => {
    vi.stubEnv(postHogProjectTokenEnvVar, "phc_test");
    vi.stubEnv(postHogHostEnvVar, "https://eu.i.posthog.com/path/");

    expect(getPostHogConfig()?.host).toBe("https://eu.i.posthog.com");
  });

  it("does not initialize with an invalid host or explicit opt-out", () => {
    vi.stubEnv(postHogProjectTokenEnvVar, "phc_test");
    vi.stubEnv(postHogHostEnvVar, "javascript:alert(1)");

    expect(getPostHogConfig()).toBeNull();

    vi.stubEnv(postHogHostEnvVar, "https://us.i.posthog.com");
    vi.stubEnv(postHogEnabledEnvVar, "false");

    expect(getPostHogConfig()).toBeNull();
  });
});

describe("serializeForInlineScript", () => {
  it("escapes characters that could terminate an inline script", () => {
    expect(serializeForInlineScript("</script>&")).toBe('"\\u003c/script\\u003e\\u0026"');
  });
});

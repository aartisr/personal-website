import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clarityProjectIdEnvVar,
  getMicrosoftClarityProjectId,
} from "@/lib/clarity";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Microsoft Clarity config", () => {
  it("returns null when the project id is not configured", () => {
    vi.stubEnv(clarityProjectIdEnvVar, "");

    expect(getMicrosoftClarityProjectId()).toBeNull();
  });

  it("normalizes the configured project id", () => {
    vi.stubEnv(clarityProjectIdEnvVar, "  abc123xyz  ");

    expect(getMicrosoftClarityProjectId()).toBe("abc123xyz");
  });
});

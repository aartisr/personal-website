import { afterEach, describe, expect, it, vi } from "vitest";
import {
  callClarity,
  clarityProjectIdEnvVar,
  getMicrosoftClarityProjectId,
} from "@/lib/clarity";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
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

describe("callClarity", () => {
  it("calls window.clarity when it is available", () => {
    const spy = vi.fn();
    vi.stubGlobal("window", { clarity: spy });

    callClarity("event", "test-event");

    expect(spy).toHaveBeenCalledWith("event", "test-event");
  });

  it("does not throw when window.clarity is not loaded", () => {
    vi.stubGlobal("window", {});

    expect(() => callClarity("event", "no-clarity")).not.toThrow();
  });

  it("forwards all arguments to window.clarity", () => {
    const spy = vi.fn();
    vi.stubGlobal("window", { clarity: spy });

    callClarity("identify", "user-123", "session-456", "page-789");

    expect(spy).toHaveBeenCalledWith("identify", "user-123", "session-456", "page-789");
  });
});

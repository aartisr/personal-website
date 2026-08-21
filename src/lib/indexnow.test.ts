import { describe, expect, it, vi } from "vitest";
import { buildIndexNowPayload, INDEXNOW_KEY, INDEXNOW_KEY_PATH } from "@/lib/indexnow";

describe("IndexNow payload", () => {
  it("submits only canonical sitemap URLs with the root ownership key", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu");
    const payload = buildIndexNowPayload();

    expect(payload.host).toBe("example.edu");
    expect(payload.key).toBe(INDEXNOW_KEY);
    expect(payload.keyLocation).toBe(`https://example.edu${INDEXNOW_KEY_PATH}`);
    expect(payload.urlList).toContain("https://example.edu/blog");
    expect(payload.urlList).not.toContain("https://example.edu/admin");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("uses fallback when NEXT_PUBLIC_SITE_URL is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://aartisr.github.io/personal-website");
  });

  it("trims whitespace and trailing slash from configured URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "  https://example.com/  ");
    expect(getSiteUrl()).toBe("https://example.com");
  });
});

describe("absoluteUrl", () => {
  it("normalizes a relative path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(absoluteUrl("blog")).toBe("https://example.com/blog");
  });

  it("preserves an absolute path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(absoluteUrl("/support-center")).toBe(
      "https://example.com/support-center"
    );
  });
});

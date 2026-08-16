import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("includes flagship Puck resources without inventing modification dates", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu");
    const entries = sitemap();
    const homepage = entries.find((entry) => entry.url === "https://example.edu");
    const framework = entries.find(
      (entry) => entry.url === "https://example.edu/aether-framework"
    );

    expect(homepage).toMatchObject({ priority: 1, changeFrequency: "weekly" });
    expect(homepage).not.toHaveProperty("lastModified");
    expect(framework).toMatchObject({ priority: 0.72, changeFrequency: "weekly" });
    expect(framework).not.toHaveProperty("lastModified");
  });
});

import { describe, expect, it } from "vitest";
import { resolvePageSlug } from "@/lib/resolve-path";

describe("resolvePageSlug", () => {
  it("returns homepage for undefined input", () => {
    expect(resolvePageSlug()).toBe("homepage");
  });

  it("returns homepage for empty segments", () => {
    expect(resolvePageSlug([])).toBe("homepage");
  });

  it("joins multi-segment paths with dashes", () => {
    expect(resolvePageSlug(["blog", "post-1"])).toBe("blog-post-1");
  });
});

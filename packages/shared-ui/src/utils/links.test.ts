import { describe, expect, it } from "vitest";
import {
  isExternalHref,
  normalizeLink,
  sanitizeHref,
} from "./links";

describe("shared link utilities", () => {
  it("keeps supported internal and external link schemes", () => {
    expect(sanitizeHref("/support-center")).toBe("/support-center");
    expect(sanitizeHref("#research")).toBe("#research");
    expect(sanitizeHref("mailto:hello@example.com")).toBe("mailto:hello@example.com");
    expect(sanitizeHref("https://example.com/path")).toBe("https://example.com/path");
  });

  it("neutralizes missing, malformed, and unsafe editor values", () => {
    expect(sanitizeHref(undefined)).toBe("#");
    expect(sanitizeHref("javascript:alert(1)")).toBe("#");
    expect(sanitizeHref("data:text/html,unsafe")).toBe("#");
  });

  it("normalizes only links with meaningful labels", () => {
    expect(normalizeLink({ label: "  Support ", href: "/support-center" })).toEqual({
      label: "Support",
      href: "/support-center",
    });
    expect(normalizeLink({ label: " ", href: "/support-center" })).toBeNull();
    expect(isExternalHref("https://example.com")).toBe(true);
    expect(isExternalHref("/support-center")).toBe(false);
  });
});

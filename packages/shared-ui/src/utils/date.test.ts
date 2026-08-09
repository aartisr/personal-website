import { describe, expect, it } from "vitest";
import { formatEditorialDate } from "./date";

describe("formatEditorialDate", () => {
  it("keeps date-only editorial content on its intended calendar day", () => {
    expect(formatEditorialDate("2026-03-06")).toBe("March 6, 2026");
  });

  it("leaves malformed values unchanged", () => {
    expect(formatEditorialDate("not-a-date")).toBe("not-a-date");
  });
});

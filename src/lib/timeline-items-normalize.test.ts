import { describe, expect, it } from "vitest";
import { normalizeTimelineItems } from "../../packages/shared-ui/src/components/timeline-section/normalize-timeline-items";

describe("normalizeTimelineItems", () => {
  it("returns empty array for non-array payloads", () => {
    expect(normalizeTimelineItems(undefined)).toEqual([]);
    expect(normalizeTimelineItems(null)).toEqual([]);
    expect(normalizeTimelineItems("bad-payload")).toEqual([]);
  });

  it("filters invalid entries and normalizes missing fields", () => {
    const input = [
      { year: "2025", title: "Milestone", description: "Reached", image: "" },
      { title: "Only title" },
      "invalid-entry",
      null,
      { year: 2026, image: true },
    ];

    expect(normalizeTimelineItems(input)).toEqual([
      { year: "2025", title: "Milestone", description: "Reached", image: "" },
      { year: "", title: "Only title", description: "", image: "" },
      { year: "", title: "", description: "", image: "" },
    ]);
  });
});
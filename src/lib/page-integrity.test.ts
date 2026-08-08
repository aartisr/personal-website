import { describe, expect, it } from "vitest";
import {
  getHomepageSaveRejection,
  pageSaveRejectionMessage,
} from "@/lib/page-integrity";

const requiredBlocks = [
  { type: "Header", props: { id: "header", brandName: "Aarti" } },
  { type: "HeroSection", props: { id: "hero", heading: "Welcome" } },
  { type: "TimelineSection", props: { id: "timeline", heading: "Journey" } },
];

describe("homepage save integrity", () => {
  it("rejects empty, small, and incomplete homepage payloads", () => {
    expect(getHomepageSaveRejection({ content: [] })).toBe("empty");
    expect(getHomepageSaveRejection({ content: [{ type: "Header", props: {} }] })).toBe(
      "too_small"
    );
    expect(getHomepageSaveRejection({ content: requiredBlocks.slice(0, 2) })).toBe(
      "too_small"
    );
    expect(
      getHomepageSaveRejection({
        content: [
          requiredBlocks[0],
          requiredBlocks[1],
          { type: "StatsCounter", props: { value: "1" } },
        ],
      })
    ).toBe("missing_required_blocks");
  });

  it("rejects id-only required blocks but accepts meaningful homepage data", () => {
    expect(
      getHomepageSaveRejection({
        content: requiredBlocks.map(({ type, props }) => ({ type, props: { id: props.id } })),
      })
    ).toBe("skeleton");
    expect(getHomepageSaveRejection({ content: requiredBlocks })).toBeNull();
  });

  it("keeps error messages centralized and actionable", () => {
    expect(pageSaveRejectionMessage("empty")).toContain("Retry with ?force=1");
  });
});

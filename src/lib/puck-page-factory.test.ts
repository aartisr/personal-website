import { describe, expect, it } from "vitest";
import {
  createDefaultPageData,
  ensureContentIds,
  ensureReusableLayoutBlocks,
} from "@/lib/puck-page-factory";

describe("puck page factory", () => {
  it("creates an editable page with named layout blocks and IDs", () => {
    const page = createDefaultPageData("research-notes");
    expect(page.root.props?.title).toBe("Research Notes");
    expect(page.content.map((block) => block.type)).toEqual(["Header", "HeroSection", "Footer"]);
    expect(page.content.every((block) => typeof block.props.id === "string")).toBe(true);
  });

  it("adds missing IDs without changing an existing ID", () => {
    const page = ensureContentIds({
      root: { props: {} },
      content: [
        { type: "HeroSection", props: {} },
        { type: "Footer", props: { id: "saved-footer" } },
      ],
    } as any);

    expect(page.content[0].props.id).toMatch(/^HeroSection-/);
    expect(page.content[1].props.id).toBe("saved-footer");
  });

  it("restores missing reusable layout blocks", () => {
    const page = ensureReusableLayoutBlocks({
      root: { props: {} },
      content: [{ type: "HeroSection", props: {} }],
    } as any);

    expect(page.content.map((block) => block.type)).toEqual(["Header", "HeroSection", "Footer"]);
  });
});

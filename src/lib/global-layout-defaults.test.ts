import { describe, expect, it } from "vitest";
import {
  createDefaultGlobalLayoutData,
  createDefaultGlobalLayoutSectionData,
  extractGlobalLayoutBlocks,
} from "@/lib/global-layout-defaults";

describe("global layout defaults", () => {
  it("creates a complete global header and footer", () => {
    const layout = createDefaultGlobalLayoutData();
    expect(layout.content.map((block) => block.type)).toEqual(["Header", "Footer"]);
    expect(layout.content.every((block) => typeof block.props.id === "string")).toBe(true);
  });

  it("uses supplied layout blocks and fills in missing layout", () => {
    const blocks = extractGlobalLayoutBlocks({
      root: { props: {} },
      content: [{ type: "Header", props: { id: "chosen-header" } }],
    } as any);

    expect(blocks.header.props.id).toBe("chosen-header");
    expect(blocks.footer.type).toBe("Footer");
    expect(blocks.footer.props.id).toMatch(/^Footer-global-/);
  });

  it("creates one reusable section at a time", () => {
    const footer = createDefaultGlobalLayoutSectionData("footer");
    expect(footer.root.props?.title).toBe("Global Footer");
    expect(footer.content).toHaveLength(1);
    expect(footer.content[0].type).toBe("Footer");
  });
});

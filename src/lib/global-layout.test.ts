import { describe, expect, it, vi } from "vitest";

const fs = vi.hoisted(() => ({
  existsSync: vi.fn(() => false),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("fs", () => fs);

import {
  applyGlobalLayout,
  getGlobalLayoutData,
  saveGlobalLayoutData,
  saveGlobalLayoutSectionData,
} from "@/lib/global-layout";

describe("global layout repository", () => {
  it("uses a complete default layout when no saved file exists", () => {
    const layout = getGlobalLayoutData();
    expect(layout.root.props?.title).toBe("Global Layout");
    expect(layout.content.map((block) => block.type)).toEqual(["Header", "Footer"]);
  });

  it("persists only the reusable header and footer blocks", () => {
    saveGlobalLayoutData({
      root: { props: { title: "Ignored" } },
      content: [
        { type: "HeroSection", props: {} },
        { type: "Header", props: { id: "header-one" } },
        { type: "Footer", props: { id: "footer-one" } },
      ],
    } as any);

    const written = JSON.parse(fs.writeFileSync.mock.calls.at(-1)?.[1] as string);
    expect(written.root.props.title).toBe("Global Layout");
    expect(written.content.map((block: { type: string }) => block.type)).toEqual(["Header", "Footer"]);
  });

  it("applies the saved layout around page-specific content", () => {
    const page = applyGlobalLayout({
      root: { props: {} },
      content: [
        { type: "Header", props: {} },
        { type: "HeroSection", props: {} },
        { type: "Footer", props: {} },
      ],
    } as any);

    expect(page.content.map((block) => block.type)).toEqual(["Header", "HeroSection", "Footer"]);
  });

  it("replaces one reusable layout section without dropping the other", () => {
    saveGlobalLayoutSectionData("header", {
      root: { props: {} },
      content: [{ type: "Footer", props: { id: "wrong-type" } }],
    } as any);

    const written = JSON.parse(fs.writeFileSync.mock.calls.at(-1)?.[1] as string);
    expect(written.content.map((block: { type: string }) => block.type)).toEqual(["Header", "Footer"]);
    expect(written.content[0].props.id).toBe("wrong-type");
  });
});

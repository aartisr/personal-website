import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  deletePage,
  getPageData,
  listPages,
  savePageData,
} from "@/lib/get-page-data";

describe("get-page-data utilities", () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = mkdtempSync(join(tmpdir(), "pw-content-"));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("saves and loads page data", () => {
    const payload = {
      root: {
        props: { title: "Test Page" },
      },
      content: [],
    } as any;

    savePageData("test-page", payload);

    expect(getPageData("test-page")).toEqual(payload);
  });

  it("lists pages with title fallback", () => {
    savePageData("my-page", { root: { props: { title: "My Page" } } } as any);
    savePageData("second-page", { root: {} } as any);

    expect(listPages()).toEqual(
      expect.arrayContaining([
        { slug: "my-page", title: "My Page" },
        { slug: "second-page", title: "Second Page" },
      ])
    );
  });

  it("supports nested page slugs", () => {
    const payload = { root: { props: { title: "Nested Docs" } }, content: [] } as any;

    savePageData("docs/getting-started", payload);

    expect(getPageData("docs/getting-started")).toEqual(payload);
    expect(listPages()).toEqual(
      expect.arrayContaining([{ slug: "docs/getting-started", title: "Nested Docs" }])
    );
  });

  it("deletes an existing page", () => {
    savePageData("to-delete", { root: {} } as any);

    expect(deletePage("to-delete")).toBe(true);
    expect(getPageData("to-delete")).toBeNull();
    expect(deletePage("to-delete")).toBe(false);
  });

  it("returns null for invalid json files", () => {
    mkdirSync(join(tempDir, "content"), { recursive: true });
    writeFileSync(join(tempDir, "content", "broken.json"), "{ not-json ");

    expect(getPageData("broken")).toBeNull();
  });

  it("ignores non-Puck json files when listing pages", () => {
    mkdirSync(join(tempDir, "content", "blog"), { recursive: true });
    writeFileSync(
      join(tempDir, "content", "blog", "post.json"),
      JSON.stringify({ title: "A Blog Post", excerpt: "not a puck page" }, null, 2)
    );

    expect(listPages().some((page) => page.slug === "blog/post")).toBe(false);
  });
});

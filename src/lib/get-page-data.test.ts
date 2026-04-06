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
});

import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/pages/route";
import { savePageData } from "@/lib/get-page-data";

describe("GET /api/pages", () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = mkdtempSync(join(tmpdir(), "pw-pages-route-"));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns the list of pages", async () => {
    savePageData("homepage", { root: { props: { title: "Home" } } } as any);

    const response = await GET();
    const data = (await response.json()) as Array<{ slug: string; title: string }>;

    expect(response.status).toBe(200);
    expect(data).toEqual(expect.arrayContaining([{ slug: "homepage", title: "Home" }]));
  });
});

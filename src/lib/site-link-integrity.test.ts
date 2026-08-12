import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

const PAGES_DIR = join(process.cwd(), "content", "pages");
const BLOG_DIR = join(process.cwd(), "content", "blog");
const STATIC_PATHS = new Set(["/", "/blog", "/web3-proof", "/aether-student-resiliency-framework-2026.pdf"]);

function pagePaths(directory: string, prefix = ""): string[] {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = join(directory, name);
    if (statSync(fullPath).isDirectory()) return pagePaths(fullPath, `${prefix}/${name}`);
    if (!name.endsWith(".json")) return [];
    const slug = `${prefix}/${name.replace(/\.json$/, "")}`;
    return [slug === "/homepage" ? "/" : slug];
  });
}

function collectHrefs(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectHrefs);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    if (key === "href" && typeof nested === "string") return [nested];
    return collectHrefs(nested);
  });
}

function blogPaths(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => `/blog/${name.replace(/\.json$/, "")}`);
}

describe("published internal links", () => {
  it("only point to an existing route, known asset, or homepage anchor", () => {
    const allowed = new Set([...STATIC_PATHS, ...pagePaths(PAGES_DIR), ...blogPaths()]);
    const pageFiles = pagePaths(PAGES_DIR).map((path) => path === "/" ? join(PAGES_DIR, "homepage.json") : join(PAGES_DIR, `${path}.json`));
    const invalid = pageFiles.flatMap((filePath) => {
      const hrefs = collectHrefs(JSON.parse(readFileSync(filePath, "utf8")));
      return hrefs.filter((href) => {
        if (!href.startsWith("/") || href.startsWith("//")) return false;
        const pathname = href.split(/[?#]/, 1)[0] || "/";
        return !allowed.has(pathname);
      }).map((href) => `${filePath.replace(`${process.cwd()}/`, "")}: ${href}`);
    });
    expect(invalid).toEqual([]);
  });
});

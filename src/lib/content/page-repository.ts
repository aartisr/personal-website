import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import type { Data } from "@puckeditor/core";
import { normalizePageSlug, slugToSegments, slugToTitle } from "@/lib/page-slug";

export type PageSummary = {
  slug: string;
  title: string;
};

function getLegacyContentDir(): string {
  return join(process.cwd(), "content");
}

function getPagesContentDir(): string {
  return join(process.cwd(), "content", "pages");
}

function parsePageData(raw: string): Data | null {
  try {
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

function isPuckPageData(value: unknown): value is Data {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeData = value as { root?: unknown; content?: unknown };
  return (
    (!!maybeData.root && typeof maybeData.root === "object") ||
    Array.isArray(maybeData.content)
  );
}

function pageFilePath(slug: string, contentDir: string): string {
  const segments = slugToSegments(normalizePageSlug(slug));

  return segments.length === 0
    ? join(contentDir, "homepage.json")
    : join(contentDir, ...segments) + ".json";
}

function filePathToSlug(contentDir: string, filePath: string): string {
  const relative = filePath
    .replace(contentDir, "")
    .replace(/^\/+/, "")
    .replace(/\.json$/, "")
    .replace(/\\/g, "/");

  return normalizePageSlug(relative);
}

function walkJsonFiles(dirPath: string): string[] {
  if (!existsSync(dirPath)) {
    return [];
  }

  return readdirSync(dirPath).flatMap((entry) => {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    return stats.isDirectory()
      ? walkJsonFiles(fullPath)
      : entry.endsWith(".json")
        ? [fullPath]
        : [];
  });
}

function readPageFile(filePath: string): Data | null {
  if (!existsSync(filePath)) {
    return null;
  }

  return parsePageData(readFileSync(filePath, "utf-8"));
}

/**
 * Filesystem-backed repository for editable Puck pages. Route code must use
 * this boundary rather than constructing content paths or parsing JSON itself.
 */
export const pageRepository = {
  list(): PageSummary[] {
    const pagesDir = getPagesContentDir();
    const contentDir = existsSync(pagesDir) ? pagesDir : getLegacyContentDir();

    return walkJsonFiles(contentDir)
      .flatMap((filePath) => {
        const data = readPageFile(filePath);
        if (!isPuckPageData(data)) {
          return [];
        }

        const slug = filePathToSlug(contentDir, filePath);
        const title =
          (data.root as { props?: { title?: string } } | undefined)?.props?.title ||
          slugToTitle(slug);

        return [{ slug, title }];
      })
      .sort((first, second) => {
        if (first.slug === "homepage") return -1;
        if (second.slug === "homepage") return 1;
        return first.slug.localeCompare(second.slug);
      });
  },

  get(slug: string): Data | null {
    const currentData = readPageFile(pageFilePath(slug, getPagesContentDir()));
    if (isPuckPageData(currentData)) {
      return currentData;
    }

    const legacyData = readPageFile(pageFilePath(slug, getLegacyContentDir()));
    return isPuckPageData(legacyData) ? legacyData : null;
  },

  save(slug: string, data: Data): void {
    const filePath = pageFilePath(slug, getPagesContentDir());
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  },

  delete(slug: string): boolean {
    const normalizedSlug = normalizePageSlug(slug);
    if (normalizedSlug === "homepage") {
      return false;
    }

    const filePath = pageFilePath(normalizedSlug, getPagesContentDir());
    if (!existsSync(filePath)) {
      return false;
    }

    unlinkSync(filePath);
    return true;
  },
};

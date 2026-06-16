import {
  readFileSync,
  readdirSync,
  existsSync,
  unlinkSync,
  writeFileSync,
  mkdirSync,
  statSync,
} from "fs";
import { dirname, join } from "path";
import type { Data } from "@puckeditor/core";
import { normalizePageSlug, slugToTitle, slugToSegments } from "@/lib/page-slug";

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
  const hasRoot = !!maybeData.root && typeof maybeData.root === "object";
  const hasContent = Array.isArray(maybeData.content);
  return hasRoot || hasContent;
}

function slugToPageFilePath(slug: string): string {
  const normalizedSlug = normalizePageSlug(slug);
  const segments = slugToSegments(normalizedSlug);
  const contentDir = getPagesContentDir();

  if (segments.length === 0) {
    return join(contentDir, "homepage.json");
  }

  return join(contentDir, ...segments) + ".json";
}

function slugToLegacyPageFilePath(slug: string): string {
  const normalizedSlug = normalizePageSlug(slug);
  const segments = slugToSegments(normalizedSlug);
  const contentDir = getLegacyContentDir();

  if (segments.length === 0) {
    return join(contentDir, "homepage.json");
  }

  return join(contentDir, ...segments) + ".json";
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

  const entries = readdirSync(dirPath);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

export function listPages(): { slug: string; title: string }[] {
  const pagesDir = getPagesContentDir();
  const legacyDir = getLegacyContentDir();
  const contentDir = existsSync(pagesDir) ? pagesDir : legacyDir;

  if (!existsSync(contentDir)) return [];

  return walkJsonFiles(contentDir)
    .map((filePath) => {
      const slug = filePathToSlug(contentDir, filePath);
      const raw = readFileSync(filePath, "utf-8");
      const data = parsePageData(raw);

      if (!isPuckPageData(data)) {
        return null;
      }

      const title =
        (data?.root as { props?: { title?: string } })?.props?.title ||
        slugToTitle(slug);

      return { slug, title };
    })
    .filter((entry): entry is { slug: string; title: string } => Boolean(entry))
    .sort((first, second) => {
      if (first.slug === "homepage") return -1;
      if (second.slug === "homepage") return 1;
      return first.slug.localeCompare(second.slug);
    });
}

export function deletePage(slug: string): boolean {
  const normalizedSlug = normalizePageSlug(slug);

  if (normalizedSlug === "homepage") {
    return false;
  }

  const filePath = slugToPageFilePath(normalizedSlug);
  if (!existsSync(filePath)) return false;
  unlinkSync(filePath);
  return true;
}

export function getPageData(slug: string): Data | null {
  const currentPath = slugToPageFilePath(slug);

  if (existsSync(currentPath)) {
    const currentRaw = readFileSync(currentPath, "utf-8");
    const currentData = parsePageData(currentRaw);
    return isPuckPageData(currentData) ? currentData : null;
  }

  const legacyPath = slugToLegacyPageFilePath(slug);

  if (!existsSync(legacyPath)) {
    return null;
  }

  const legacyRaw = readFileSync(legacyPath, "utf-8");
  const legacyData = parsePageData(legacyRaw);
  return isPuckPageData(legacyData) ? legacyData : null;
}

export function savePageData(slug: string, data: Data): void {
  const normalizedSlug = normalizePageSlug(slug);
  const contentDir = getPagesContentDir();
  const filePath = slugToPageFilePath(normalizedSlug);

  mkdirSync(contentDir, { recursive: true });
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

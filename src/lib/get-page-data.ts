import {
  readFileSync,
  readdirSync,
  existsSync,
  unlinkSync,
  writeFileSync,
  mkdirSync,
} from "fs";
import { join } from "path";
import type { Data } from "@puckeditor/core";

function getContentDir(): string {
  return join(process.cwd(), "content");
}

function toTitleFromSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function parsePageData(raw: string): Data | null {
  try {
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function listPages(): { slug: string; title: string }[] {
  const contentDir = getContentDir();
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const slug = f.replace(/\.json$/, "");
      const data = getPageData(slug);
      const title =
        (data?.root as { props?: { title?: string } })?.props?.title ||
        toTitleFromSlug(slug);
      return { slug, title };
    });
}

export function deletePage(slug: string): boolean {
  const filePath = join(getContentDir(), `${slug}.json`);
  if (!existsSync(filePath)) return false;
  unlinkSync(filePath);
  return true;
}

export function getPageData(slug: string): Data | null {
  const filePath = join(getContentDir(), `${slug}.json`);
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf-8");
  return parsePageData(raw);
}

export function savePageData(slug: string, data: Data): void {
  const contentDir = getContentDir();
  const filePath = join(contentDir, `${slug}.json`);
  mkdirSync(contentDir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

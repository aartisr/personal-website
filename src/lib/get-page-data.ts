/**
 * Compatibility facade for existing route and test imports.
 * New server code should prefer pageRepository for an explicit storage boundary.
 */
import type { Data } from "@puckeditor/core";
import { pageRepository, type PageSummary } from "@/lib/content/page-repository";

export type { PageSummary };

export function listPages(): PageSummary[] {
  return pageRepository.list();
}

export function getPageData(slug: string): Data | null {
  return pageRepository.get(slug);
}

export function savePageData(slug: string, data: Data): void {
  pageRepository.save(slug, data);
}

export function deletePage(slug: string): boolean {
  return pageRepository.delete(slug);
}

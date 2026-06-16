import { resolvePageSlugFromSegments } from "@/lib/page-slug";

/**
 * Resolves a URL path segments array to a content file name.
 * - [] or undefined -> "homepage"
 * - ["about"] -> "about"
 * - ["blog", "my-post"] -> "blog/my-post"
 */
export function resolvePageSlug(puckPath?: string[]): string {
  return resolvePageSlugFromSegments(puckPath);
}

function sanitizeSegment(segment: string): string {
  return segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToTitle(slug: string): string {
  if (slug === "homepage") {
    return "Homepage";
  }

  return slug
    .split("/")
    .join(" ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizePageSlug(rawSlug?: string | null): string {
  if (!rawSlug) {
    return "homepage";
  }

  const cleaned = rawSlug
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => sanitizeSegment(segment))
    .filter(Boolean)
    .join("/");

  return cleaned || "homepage";
}

export function resolvePageSlugFromSegments(puckPath?: string[]): string {
  if (!puckPath || puckPath.length === 0) {
    return "homepage";
  }

  return normalizePageSlug(puckPath.join("/"));
}

export function slugToSegments(slug: string): string[] {
  const normalized = normalizePageSlug(slug);

  if (normalized === "homepage") {
    return [];
  }

  return normalized.split("/");
}

export function viewPathFromSlug(slug: string): string {
  const normalized = normalizePageSlug(slug);
  return normalized === "homepage" ? "/" : `/${normalized}`;
}

export function editorPathFromSlug(slug: string): string {
  const normalized = normalizePageSlug(slug);
  return normalized === "homepage"
    ? "/admin/edit"
    : `/admin/edit/${normalized}`;
}

export function apiPathFromSlug(slug: string): string {
  const normalized = normalizePageSlug(slug);
  return `/api/page/${normalized}`;
}
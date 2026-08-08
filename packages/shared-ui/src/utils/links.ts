import { toText } from "./text";

export type SafeLink = {
  label: string;
  href: string;
};

/**
 * Allows only same-site paths, hash links, mail/tel links, and HTTP(S) URLs.
 * Returning "#" preserves a harmless rendered fallback for malformed editor data.
 */
export function sanitizeHref(rawHref: unknown): string {
  const href = toText(rawHref);

  if (!href) return "#";
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return href;

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : "#";
  } catch {
    return "#";
  }
}

export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function normalizeLink(value: unknown): SafeLink | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as { label?: unknown; href?: unknown };
  const label = toText(candidate.label);

  return label ? { label, href: sanitizeHref(candidate.href) } : null;
}

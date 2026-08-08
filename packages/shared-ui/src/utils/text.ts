/**
 * Converts editor-provided content to a trimmed string without coercing
 * non-text values. Shared UI blocks treat CMS data as untrusted at runtime.
 */
export function toText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

import type { TimelineItem } from "./timeline-section";

export function normalizeTimelineItems(items: unknown): TimelineItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      year: typeof item.year === "string" ? item.year : "",
      title: typeof item.title === "string" ? item.title : "",
      description: typeof item.description === "string" ? item.description : "",
      image: typeof item.image === "string" ? item.image : "",
    }));
}
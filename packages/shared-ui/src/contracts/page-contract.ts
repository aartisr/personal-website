export const PUCK_BLOCK_TYPE = {
  HEADER: "Header",
  HERO_SECTION: "HeroSection",
  RESEARCH_SHOWCASE: "ResearchShowcase",
  TIMELINE_SECTION: "TimelineSection",
  STATS_COUNTER: "StatsCounter",
} as const;

export const HOMEPAGE_REQUIRED_BLOCK_TYPES = [
  PUCK_BLOCK_TYPE.HEADER,
  PUCK_BLOCK_TYPE.HERO_SECTION,
  PUCK_BLOCK_TYPE.TIMELINE_SECTION,
] as const;

export const GITHUB_STAT_LABEL_PATTERNS = {
  contributions: ["github contribution"],
  publicRepos: ["public repositor", "pubic repositor"],
  researchTracks: ["research track", "active track"],
} as const;

export type PuckBlock = {
  type?: string;
  props?: Record<string, unknown>;
};

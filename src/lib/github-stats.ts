import type { Data } from "@puckeditor/core";
import {
  GITHUB_STAT_LABEL_PATTERNS,
  PUCK_BLOCK_TYPE,
} from "@kindoms/shared-ui/contracts/page-contract";

const DEFAULT_GITHUB_USER = "aartisr";
const CACHE_TTL_MS = 60 * 60 * 1000;
const HYDRATION_TIMEOUT_MS = 120;
const ACTIVE_LOOKBACK_DAYS = 180;
const GITHUB_METRICS_ENABLED_ENV = "GITHUB_METRICS_ENABLED";
const ENABLED_ENV_VALUES = new Set(["1", "true", "yes", "on"]);
const DISABLED_ENV_VALUES = new Set(["0", "false", "no", "off"]);
const TRACK_TOPIC_ALLOWLIST = new Set([
  "research",
  "ai",
  "ml",
  "machine-learning",
  "data-science",
  "web3",
  "blockchain",
  "education",
  "analytics",
  "robotics",
  "nlp",
]);
const TRACK_LANGUAGE_ALLOWLIST = new Set([
  "python",
  "typescript",
  "javascript",
  "java",
  "go",
  "rust",
  "solidity",
  "c",
  "c++",
  "c#",
  "r",
  "kotlin",
  "swift",
]);

type GithubStats = {
  contributions: number;
  publicRepos: number;
  activeResearchTracks: number;
};

export const GITHUB_METRIC_KEYS = {
  contributions: "githubContributions",
  publicRepos: "githubPublicRepos",
  activeResearchTracks: "githubActiveResearchTracks",
} as const;

export type DynamicMetricValue = {
  value: string;
  prefix: string;
  suffix: string;
  label: string;
};

export type GithubMetricPayload = {
  ok: true;
  source: "github";
  username: string;
  updatedAt: string;
  revalidateSeconds: number;
  metrics: Record<string, DynamicMetricValue>;
};

type GithubUserResponse = {
  public_repos?: number;
};

type GithubRepoResponse = {
  fork?: boolean;
  pushed_at?: string;
  topics?: string[];
  language?: string | null;
};

type GithubCommitSearchResponse = {
  total_count?: number;
};

type GithubPublicEvent = {
  type?: string;
  created_at?: string;
  payload?: {
    size?: number;
  };
};

let cache: { expiresAt: number; value: GithubStats } | null = null;

/**
 * Remote GitHub requests stay off during local development unless deliberately
 * enabled. This keeps the page fast and avoids certificate-chain noise on
 * managed networks, while production continues to use live metrics by default.
 */
export function isGithubMetricsEnabled(): boolean {
  const configured = process.env[GITHUB_METRICS_ENABLED_ENV]
    ?.trim()
    .toLowerCase();

  if (configured && ENABLED_ENV_VALUES.has(configured)) {
    return true;
  }

  if (configured && DISABLED_ENV_VALUES.has(configured)) {
    return false;
  }

  return process.env.NODE_ENV !== "development";
}

function getGithubUsername(): string {
  return process.env.GITHUB_USERNAME?.trim() || DEFAULT_GITHUB_USER;
}

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();

  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchPublicRepoCount(username: string): Promise<number> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: githubHeaders(),
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`GitHub user request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GithubUserResponse;
  return Math.max(0, payload.public_repos ?? 0);
}

async function fetchContributionsLastYear(username: string): Promise<number> {
  const token = process.env.GITHUB_TOKEN?.trim();

  // Most reliable source when a token is available.
  if (token) {
    try {
      const toDate = new Date();
      const fromDate = new Date(toDate);
      fromDate.setFullYear(toDate.getFullYear() - 1);

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query ($login: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $login) {
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    totalContributions
                  }
                }
              }
            }
          `,
          variables: {
            login: username,
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
          },
        }),
        next: { revalidate: 60 * 60 },
      });

      if (response.ok) {
        const payload = (await response.json()) as {
          data?: {
            user?: {
              contributionsCollection?: {
                contributionCalendar?: { totalContributions?: number };
              };
            };
          };
        };

        const total =
          payload.data?.user?.contributionsCollection?.contributionCalendar
            ?.totalContributions;

        if (typeof total === "number" && total > 0) {
          return total;
        }
      }
    } catch {
      // Fall through to public API methods.
    }
  }

  // Public fallback that avoids low commit-search rate limits: sum push-event commits.
  try {
    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setFullYear(toDate.getFullYear() - 1);
    const fromTs = fromDate.getTime();

    let totalFromEvents = 0;
    let reachedOlderEvents = false;

    for (let page = 1; page <= 3; page += 1) {
      const response = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
        {
          headers: githubHeaders(),
          next: { revalidate: 60 * 60 },
        }
      );

      if (!response.ok) {
        break;
      }

      const events = (await response.json()) as GithubPublicEvent[];
      if (!Array.isArray(events) || events.length === 0) {
        break;
      }

      for (const event of events) {
        const createdAt = Date.parse(event.created_at ?? "");
        if (Number.isNaN(createdAt) || createdAt < fromTs) {
          reachedOlderEvents = true;
          continue;
        }

        if (event.type === "PushEvent") {
          totalFromEvents += Math.max(0, event.payload?.size ?? 0);
        }
      }

      if (reachedOlderEvents) {
        break;
      }
    }

    if (totalFromEvents > 0) {
      return totalFromEvents;
    }
  } catch {
    // Fall through to additional fallbacks.
  }

  // Commit search can be accurate, but is too rate-limited for anonymous traffic.
  if (token) {
    try {
      const toDate = new Date();
      const fromDate = new Date(toDate);
      fromDate.setFullYear(toDate.getFullYear() - 1);
      const from = fromDate.toISOString().slice(0, 10);

      const response = await fetch(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:>=${from}`,
        {
          headers: {
            ...githubHeaders(),
            Accept: "application/vnd.github.cloak-preview+json",
          },
          next: { revalidate: 60 * 60 },
        }
      );

      if (response.ok) {
        const payload = (await response.json()) as GithubCommitSearchResponse;
        const total = payload.total_count ?? 0;
        if (total > 0) {
          return total;
        }
      }
    } catch {
      // Fall through to HTML/SVG scrape fallback.
    }
  }

  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setFullYear(toDate.getFullYear() - 1);

  const from = fromDate.toISOString().slice(0, 10);
  const to = toDate.toISOString().slice(0, 10);

  const response = await fetch(
    `https://github.com/users/${username}/contributions?from=${from}&to=${to}`,
    {
      next: { revalidate: 60 * 60 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub contributions request failed with ${response.status}`
    );
  }

  const svg = await response.text();
  const matches = svg.matchAll(/data-count="(\d+)"/g);

  let total = 0;
  for (const match of matches) {
    total += Number.parseInt(match[1] ?? "0", 10);
  }

  return total;
}

async function fetchActiveResearchTracks(username: string): Promise<number> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: githubHeaders(),
      next: { revalidate: 60 * 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub repos request failed with ${response.status}`);
  }

  const repos = (await response.json()) as GithubRepoResponse[];
  const cutoff = Date.now() - ACTIVE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const tracks = new Set<string>();

  for (const repo of repos) {
    if (repo.fork) continue;
    if (!repo.pushed_at) continue;

    const pushedAt = Date.parse(repo.pushed_at);
    if (Number.isNaN(pushedAt) || pushedAt < cutoff) continue;

    for (const topic of repo.topics ?? []) {
      const normalized = topic.toLowerCase();
      if (TRACK_TOPIC_ALLOWLIST.has(normalized)) {
        tracks.add(normalized);
      }
    }

    if (repo.language) {
      const normalizedLanguage = repo.language.toLowerCase();
      if (TRACK_LANGUAGE_ALLOWLIST.has(normalizedLanguage)) {
        tracks.add(normalizedLanguage);
      }
    }
  }

  return Math.max(1, tracks.size);
}

export async function getGithubStats(): Promise<GithubStats> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.value;
  }

  const username = getGithubUsername();
  const [contributions, publicRepos, activeResearchTracks] = await Promise.all([
    fetchContributionsLastYear(username),
    fetchPublicRepoCount(username),
    fetchActiveResearchTracks(username),
  ]);

  const value = {
    contributions,
    publicRepos,
    activeResearchTracks,
  };

  cache = {
    expiresAt:
      value.contributions > 0
        ? Date.now() + CACHE_TTL_MS
        : Date.now() + 5 * 60 * 1000,
    value,
  };

  return value;
}

export function githubStatsToMetrics(stats: GithubStats): GithubMetricPayload {
  const metrics: Record<string, DynamicMetricValue> = {
    [GITHUB_METRIC_KEYS.publicRepos]: {
      value: String(stats.publicRepos),
      prefix: "",
      suffix: "+",
      label: "Public Repositories",
    },
    [GITHUB_METRIC_KEYS.activeResearchTracks]: {
      value: String(stats.activeResearchTracks),
      prefix: "",
      suffix: "",
      label: "Active Research Tracks",
    },
  };

  if (stats.contributions > 0) {
    metrics[GITHUB_METRIC_KEYS.contributions] = {
      value: String(stats.contributions),
      prefix: "",
      suffix: "+",
      label: "GitHub Contributions",
    };
  }

  return {
    ok: true,
    source: "github",
    username: getGithubUsername(),
    updatedAt: new Date().toISOString(),
    revalidateSeconds: Math.floor(CACHE_TTL_MS / 1000),
    metrics,
  };
}

export async function getGithubMetricPayload(): Promise<GithubMetricPayload> {
  return githubStatsToMetrics(await getGithubStats());
}

function isContributionsLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return GITHUB_STAT_LABEL_PATTERNS.contributions.some((needle) =>
    normalized.includes(needle)
  );
}

function isPublicReposLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return GITHUB_STAT_LABEL_PATTERNS.publicRepos.some((needle) =>
    normalized.includes(needle)
  );
}

function isResearchTracksLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return GITHUB_STAT_LABEL_PATTERNS.researchTracks.some((needle) =>
    normalized.includes(needle)
  );
}

function patchPageDataWithStats(data: Data, stats: GithubStats): Data {
  const content = Array.isArray((data as { content?: unknown }).content)
    ? ((data as { content: Array<{ type?: string; props?: Record<string, unknown> }> })
        .content as Array<{ type?: string; props?: Record<string, unknown> }>)
    : [];

  for (const block of content) {
    if (!block?.props) continue;

    if (block.type === PUCK_BLOCK_TYPE.HERO_SECTION) {
      const points = Array.isArray(block.props.proofPoints)
        ? (block.props.proofPoints as Array<{ label?: string; value?: string }>)
        : [];

      for (const point of points) {
        const label = point.label ?? "";
        if (isContributionsLabel(label)) {
          if (stats.contributions > 0) {
            point.value = `${stats.contributions}+`;
          }
        } else if (isPublicReposLabel(label)) {
          point.value = `${stats.publicRepos}+`;
        } else if (isResearchTracksLabel(label)) {
          point.value = String(stats.activeResearchTracks);
        }
      }
    }

    if (block.type === PUCK_BLOCK_TYPE.STATS_COUNTER) {
      const items = Array.isArray(block.props.stats)
        ? (block.props.stats as Array<{
            label?: string;
            value?: string;
            suffix?: string;
          }>)
        : [];

      for (const item of items) {
        const label = item.label ?? "";
        if (isContributionsLabel(label)) {
          if (stats.contributions > 0) {
            item.value = String(stats.contributions);
            item.suffix = "+";
          }
        } else if (isPublicReposLabel(label)) {
          item.value = String(stats.publicRepos);
          item.suffix = "+";
        } else if (isResearchTracksLabel(label)) {
          item.value = String(stats.activeResearchTracks);
          item.suffix = "";
        }
      }
    }
  }

  return data;
}

export async function hydratePageGithubStats(
  _slug: string,
  data: Data
): Promise<Data> {
  if (!isGithubMetricsEnabled()) {
    return data;
  }

  try {
    const stats = await Promise.race([
      getGithubStats(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), HYDRATION_TIMEOUT_MS);
      }),
    ]);

    if (!stats) {
      return data;
    }

    return patchPageDataWithStats(data, stats);
  } catch {
    return data;
  }
}

export function __resetGithubStatsCacheForTests(): void {
  cache = null;
}

import { afterEach, describe, expect, it, vi } from "vitest";
import type { Data } from "@puckeditor/core";
import {
  __resetGithubStatsCacheForTests,
  getGithubMetricPayload,
  hydratePageGithubStats,
} from "@/lib/github-stats";

function buildHomepageData(): Data {
  return {
    root: { props: {} },
    content: [
      {
        type: "HeroSection",
        props: {
          proofPoints: [
            { label: "GitHub contributions", value: "0" },
            { label: "Pubic repositories", value: "0" },
            { label: "Active research tracks", value: "0" },
          ],
        },
      },
      {
        type: "StatsCounter",
        props: {
          stats: [
            { label: "GitHub Contributions", value: "0", suffix: "" },
            { label: "Public Repositories", value: "0", suffix: "" },
            { label: "Research Tracks", value: "0", suffix: "+" },
          ],
        },
      },
    ],
  } as Data;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  __resetGithubStatsCacheForTests();
});

describe("hydratePageGithubStats", () => {
  it("patches stats from GitHub responses", async () => {
    vi.stubEnv("GITHUB_USERNAME", "octocat");

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockImplementation(async (input: string | URL | Request) => {
        const url = String(input);

        if (url.includes("/users/octocat/contributions")) {
          return new Response(
            '<svg><rect data-count="12"></rect><rect data-count="8"></rect></svg>',
            { status: 200 }
          );
        }

        if (url.endsWith("/users/octocat")) {
          return new Response(JSON.stringify({ public_repos: 9 }), {
            status: 200,
          });
        }

        if (url.includes("/users/octocat/repos")) {
          return new Response(
            JSON.stringify([
              {
                fork: false,
                pushed_at: new Date().toISOString(),
                topics: ["research", "ai"],
                language: "TypeScript",
              },
            ]),
            { status: 200 }
          );
        }

        return new Response("not found", { status: 404 });
      });

    const hydrated = await hydratePageGithubStats("homepage", buildHomepageData());
    const content = (hydrated as { content: Array<{ props: Record<string, unknown> }> })
      .content;

    const heroPoints = content[0].props.proofPoints as Array<{ value: string }>;
    expect(heroPoints[0].value).toBe("20+");
    expect(heroPoints[1].value).toBe("9+");
    expect(Number.parseInt(heroPoints[2].value, 10)).toBeGreaterThanOrEqual(2);

    const stats = content[1].props.stats as Array<{ value: string; suffix: string }>;
    expect(stats[0]).toMatchObject({ value: "20", suffix: "+" });
    expect(stats[1]).toMatchObject({ value: "9", suffix: "+" });
    expect(Number.parseInt(stats[2].value, 10)).toBeGreaterThanOrEqual(2);
    expect(stats[2]).toMatchObject({ suffix: "" });

    expect(fetchMock).toHaveBeenCalled();
  });

  it("also patches matching labels on non-homepage pages", async () => {
    vi.stubEnv("GITHUB_USERNAME", "octocat");

    vi.spyOn(global, "fetch").mockImplementation(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.includes("/users/octocat/contributions")) {
        return new Response('<svg><rect data-count="1"></rect></svg>', {
          status: 200,
        });
      }

      if (url.endsWith("/users/octocat")) {
        return new Response(JSON.stringify({ public_repos: 2 }), {
          status: 200,
        });
      }

      if (url.includes("/users/octocat/repos")) {
        return new Response(
          JSON.stringify([
            {
              fork: false,
              pushed_at: new Date().toISOString(),
              topics: ["research"],
            },
          ]),
          { status: 200 }
        );
      }

      return new Response("not found", { status: 404 });
    });

    const data = buildHomepageData();

    const result = await hydratePageGithubStats("privacy-policy", data);
    const content = (result as { content: Array<{ props: Record<string, unknown> }> })
      .content;
    const heroPoints = content[0].props.proofPoints as Array<{ value: string }>;

    expect(result).toBe(data);
    expect(heroPoints[0].value).toBe("1+");
    expect(heroPoints[1].value).toBe("2+");
    expect(heroPoints[2].value).toBe("1");
  });

  it("serializes stats for async client-side metric hydration", async () => {
    vi.stubEnv("GITHUB_USERNAME", "octocat");

    vi.spyOn(global, "fetch").mockImplementation(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.includes("/users/octocat/contributions")) {
        return new Response('<svg><rect data-count="5"></rect></svg>', {
          status: 200,
        });
      }

      if (url.endsWith("/users/octocat")) {
        return new Response(JSON.stringify({ public_repos: 7 }), {
          status: 200,
        });
      }

      if (url.includes("/users/octocat/repos")) {
        return new Response(
          JSON.stringify([
            {
              fork: false,
              pushed_at: new Date().toISOString(),
              topics: ["education", "research"],
              language: "Python",
            },
          ]),
          { status: 200 }
        );
      }

      return new Response("not found", { status: 404 });
    });

    const payload = await getGithubMetricPayload();

    expect(payload).toMatchObject({
      ok: true,
      source: "github",
      username: "octocat",
      metrics: {
        githubContributions: {
          value: "5",
          suffix: "+",
        },
        githubPublicRepos: {
          value: "7",
          suffix: "+",
        },
      },
    });
    expect(
      Number.parseInt(payload.metrics.githubActiveResearchTracks.value, 10)
    ).toBeGreaterThanOrEqual(2);
  });
});

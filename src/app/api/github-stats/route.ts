import { NextResponse } from "next/server";
import {
  getGithubMetricPayload,
  isGithubMetricsEnabled,
} from "@/lib/github-stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDGE_CACHE_SECONDS = 60 * 60;
const STALE_WHILE_REVALIDATE_SECONDS = 24 * 60 * 60;
const API_TIMEOUT_MS = 3000;

type FallbackPayload = {
  ok: false;
  source: "fallback";
  metrics: Record<string, never>;
};

function fallbackPayload(): FallbackPayload {
  return {
    ok: false,
    source: "fallback",
    metrics: {},
  };
}

function cacheHeaders() {
  return {
    "Cache-Control": `public, s-maxage=${EDGE_CACHE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
  };
}

function timeoutPayload(): Promise<FallbackPayload> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(fallbackPayload()),
      API_TIMEOUT_MS
    );
  });
}

export async function GET() {
  if (!isGithubMetricsEnabled()) {
    return NextResponse.json(fallbackPayload(), {
      status: 200,
      headers: cacheHeaders(),
    });
  }

  try {
    const payload = await Promise.race([
      getGithubMetricPayload(),
      timeoutPayload(),
    ]);

    return NextResponse.json(payload, {
      status: 200,
      headers: cacheHeaders(),
    });
  } catch {
    return NextResponse.json(
      fallbackPayload(),
      {
        status: 200,
        headers: cacheHeaders(),
      }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { submitIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const token = process.env.INDEXNOW_NOTIFY_TOKEN;
  const authorization = request.headers.get("authorization");

  return Boolean(token && authorization === `Bearer ${token}`);
}

/**
 * Notify IndexNow only after a production content change. The endpoint sends
 * the current XML sitemap URLs, never caller-supplied URLs.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await submitIndexNow();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { error: "IndexNow submission failed" },
      { status: 502 }
    );
  }
}

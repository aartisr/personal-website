import { createHash } from "crypto";

type RateLimitEntry = { count: number; resetAt: number };

const localStore = new Map<string, RateLimitEntry>();

export function getClientRateLimitKey(headers: Headers): string {
  // Hosting platforms set this before user-controlled proxy headers. It is
  // intentionally preferred when available.
  const address =
    headers.get("x-vercel-forwarded-for") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  return createHash("sha256").update(address).digest("hex");
}

function takeLocal(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = localStore.get(key);

  if (!entry || now > entry.resetAt) {
    localStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

async function takeRedis(
  key: string,
  max: number,
  windowSeconds: number
): Promise<boolean | null> {
  const url = process.env.RATE_LIMIT_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.RATE_LIMIT_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
      signal: AbortSignal.timeout(1_500),
    });
    if (!response.ok) return null;

    const result = (await response.json()) as Array<{ result?: unknown }>;
    const count = result[0]?.result;
    return typeof count === "number" ? count <= max : null;
  } catch {
    return null;
  }
}

/**
 * Uses Upstash's Redis REST API when configured, so limits are shared by all
 * serverless instances. Local memory remains a development-safe fallback.
 */
export async function takeRateLimit(
  scope: string,
  clientKey: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const key = `rate-limit:${scope}:${clientKey}`;
  const redisResult = await takeRedis(key, max, Math.ceil(windowMs / 1_000));
  return redisResult ?? takeLocal(key, max, windowMs);
}

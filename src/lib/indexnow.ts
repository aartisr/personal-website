import sitemap from "@/app/sitemap";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

// IndexNow keys are intentionally public: ownership is verified through the
// matching file at the site's root. Keep this value identical to the file in
// public/.
export const INDEXNOW_KEY = "2f04bb3a2771437db8aba059ae4b2045";
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function buildIndexNowPayload(): IndexNowPayload {
  const siteUrl = new URL(getSiteUrl());

  return {
    host: siteUrl.host,
    key: INDEXNOW_KEY,
    keyLocation: absoluteUrl(INDEXNOW_KEY_PATH),
    // The XML sitemap is the source of truth, so private and legacy routes
    // cannot accidentally be submitted.
    urlList: sitemap().map((entry) => entry.url),
  };
}

export async function submitIndexNow() {
  const payload = buildIndexNowPayload();
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    ok: response.ok,
    submitted: payload.urlList.length,
  };
}

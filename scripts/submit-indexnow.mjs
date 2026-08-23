#!/usr/bin/env node

const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10_000;

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.log(`Submit every URL from an XML sitemap to IndexNow.

Usage:
  node scripts/submit-indexnow.mjs --site https://example.com --key YOUR_KEY [options]

Options:
  --sitemap URL       Sitemap URL (default: <site>/sitemap.xml)
  --key-location URL  Public verification-file URL (default: <site>/<key>.txt)
  --endpoint URL      IndexNow endpoint (default: ${DEFAULT_ENDPOINT})
  --dry-run           Print the validated payload without submitting it
  --help              Show this help text

The key file must be publicly reachable and contain only the key before a
submission can succeed. Environment variables INDEXNOW_SITE_URL and
INDEXNOW_KEY may replace --site and --key.`);
}

function parseArguments(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") return { help: true };
    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const option = argument.match(/^--(site|key|sitemap|key-location|endpoint)$/);
    if (!option) throw new Error(`Unknown option: ${argument}`);

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${argument} requires a value`);
    }

    const property = option[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    options[property] = value;
    index += 1;
  }

  options.site ??= process.env.INDEXNOW_SITE_URL;
  options.key ??= process.env.INDEXNOW_KEY;
  return options;
}

function url(value, label) {
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    return parsed;
  } catch {
    throw new Error(`${label} must be an absolute HTTP(S) URL`);
  }
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function locations(xml) {
  return [...xml.matchAll(/<loc\s*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);
}

async function fetchSitemap(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return [];
  seen.add(sitemapUrl);

  const response = await fetch(sitemapUrl, { headers: { Accept: "application/xml,text/xml" } });
  if (!response.ok) throw new Error(`Could not fetch sitemap (${response.status}): ${sitemapUrl}`);

  const xml = await response.text();
  const entries = locations(xml);
  if (/<sitemapindex\b/i.test(xml)) {
    const nested = await Promise.all(entries.map((entry) => fetchSitemap(entry, seen)));
    return nested.flat();
  }

  if (!/<urlset\b/i.test(xml)) throw new Error(`Not an XML sitemap: ${sitemapUrl}`);
  return entries;
}

function batches(values, size) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) =>
    values.slice(index * size, (index + 1) * size)
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) return usage();
  if (!options.site || !options.key) return usage("Both --site and --key are required");
  if (!/^[A-Za-z0-9-]{8,128}$/.test(options.key)) {
    return usage("IndexNow keys must be 8–128 letters, numbers, or dashes");
  }

  const site = url(options.site, "--site");
  const sitemapUrl = url(options.sitemap ?? new URL("/sitemap.xml", site).href, "--sitemap");
  const keyLocation = url(
    options.keyLocation ?? new URL(`/${options.key}.txt`, site).href,
    "--key-location"
  );
  const endpoint = url(options.endpoint ?? DEFAULT_ENDPOINT, "--endpoint");
  const urls = [...new Set(await fetchSitemap(sitemapUrl.href))];

  if (urls.length === 0) throw new Error("The sitemap does not contain any page URLs");
  for (const value of urls) {
    const pageUrl = url(value, "Sitemap URL");
    if (pageUrl.host !== site.host) {
      throw new Error(`Sitemap URL is outside --site host: ${value}`);
    }
  }

  const payloads = batches(urls, MAX_URLS_PER_REQUEST).map((urlList) => ({
    host: site.host,
    key: options.key,
    keyLocation: keyLocation.href,
    urlList,
  }));

  if (options.dryRun) {
    console.log(JSON.stringify({ sitemap: sitemapUrl.href, payloads }, null, 2));
    return;
  }

  for (const [index, payload] of payloads.entries()) {
    const response = await fetch(endpoint.href, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(`IndexNow batch ${index + 1}/${payloads.length} failed (${response.status}): ${detail}`);
    }
    console.log(`Submitted batch ${index + 1}/${payloads.length}: ${payload.urlList.length} URLs (${response.status})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

#!/usr/bin/env node

const DEFAULT_TIMEOUT_MS = 15_000;

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.log(`Audit the public discovery signals for a website.

Usage:
  node scripts/audit-discovery.mjs --site https://example.com [options]

Options:
  --max-pages NUMBER  Maximum sitemap pages to inspect (default: all)
  --timeout NUMBER    Per-request timeout in milliseconds (default: ${DEFAULT_TIMEOUT_MS})
  --json              Print the complete report as JSON
  --help              Show this help text

Checks robots.txt, sitemap.xml, llms.txt, llms-full.txt, RSS, and every sampled
sitemap page for a successful response, canonical URL, title, description, H1,
and JSON-LD. The audit is read-only: it does not submit URLs or force indexing.`);
}

function parseArguments(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") return { help: true };
    if (argument === "--json") {
      options.json = true;
      continue;
    }

    const option = argument.match(/^--(site|max-pages|timeout)$/);
    if (!option) throw new Error(`Unknown option: ${argument}`);

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${argument} requires a value`);
    }

    options[option[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    index += 1;
  }

  options.site ??= process.env.DISCOVERY_AUDIT_SITE_URL;
  return options;
}

function absoluteHttpUrl(value, label) {
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    return parsed;
  } catch {
    throw new Error(`${label} must be an absolute HTTP(S) URL`);
  }
}

function positiveInteger(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${label} must be a positive integer`);
  }
  return parsed;
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc\s*>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);
}

async function request(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      headers: { "User-Agent": "DiscoveryReadinessAudit/1.0" },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function readSitemap(url, timeout, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);

  const response = await request(url, timeout);
  if (!response.ok) throw new Error(`Could not fetch sitemap (${response.status}): ${url}`);

  const xml = await response.text();
  const locations = sitemapLocations(xml);
  if (/<sitemapindex\b/i.test(xml)) {
    return (await Promise.all(locations.map((entry) => readSitemap(entry, timeout, seen)))).flat();
  }
  if (!/<urlset\b/i.test(xml)) throw new Error(`Not an XML sitemap: ${url}`);
  return locations;
}

function content(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function normaliseUrl(value) {
  const url = new URL(value);
  url.hash = "";
  return url.href.replace(/\/$/, "");
}

async function auditPage(url, timeout) {
  const response = await request(url, timeout);
  const page = { url, status: response.status, errors: [], warnings: [] };
  if (!response.ok) {
    page.errors.push(`Page returned HTTP ${response.status}`);
    return page;
  }

  const html = await response.text();
  const canonical = content(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || content(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const title = content(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = content(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || content(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);

  if (!canonical) {
    page.errors.push("Missing canonical link");
  } else if (normaliseUrl(new URL(canonical, url).href) !== normaliseUrl(url)) {
    page.errors.push(`Canonical URL does not match sitemap URL: ${canonical}`);
  }
  if (!title) page.errors.push("Missing page title");
  if (!description) page.errors.push("Missing meta description");
  if (h1Count !== 1) page.warnings.push(`Expected one H1, found ${h1Count}`);
  if (!hasJsonLd) page.warnings.push("No JSON-LD structured data found");
  return page;
}

async function auditTextAsset(site, path, timeout, requiredText) {
  const url = new URL(path, site).href;
  const response = await request(url, timeout);
  const result = { url, status: response.status, errors: [] };
  if (!response.ok) result.errors.push(`Returned HTTP ${response.status}`);
  else if (requiredText && !(await response.text()).includes(requiredText)) {
    result.errors.push(`Does not contain ${requiredText}`);
  }
  return result;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) return usage();
  if (!options.site) return usage("--site is required");

  const site = absoluteHttpUrl(options.site, "--site");
  const maxPages = options.maxPages ? positiveInteger(options.maxPages, "--max-pages") : Infinity;
  const timeout = options.timeout ? positiveInteger(options.timeout, "--timeout") : DEFAULT_TIMEOUT_MS;
  const robots = await auditTextAsset(site, "/robots.txt", timeout, "Sitemap:");
  const aiSummary = await auditTextAsset(site, "/llms.txt", timeout, "#");
  const aiContext = await auditTextAsset(site, "/llms-full.txt", timeout, "#");
  const rss = await auditTextAsset(site, "/blog/rss.xml", timeout, "<rss");
  const sitemapUrl = new URL("/sitemap.xml", site).href;
  const sitemapUrls = [...new Set(await readSitemap(sitemapUrl, timeout))];
  const invalidHosts = sitemapUrls.filter((value) => absoluteHttpUrl(value, "Sitemap URL").host !== site.host);
  const pageUrls = sitemapUrls.slice(0, maxPages);
  const pages = await Promise.all(pageUrls.map((url) => auditPage(url, timeout)));
  const assetErrors = [robots, aiSummary, aiContext, rss].flatMap((asset) => asset.errors.map((error) => `${asset.url}: ${error}`));
  const pageErrors = pages.flatMap((page) => page.errors.map((error) => `${page.url}: ${error}`));
  const warnings = pages.flatMap((page) => page.warnings.map((warning) => `${page.url}: ${warning}`));
  const report = {
    site: site.href.replace(/\/$/, ""),
    sitemap: sitemapUrl,
    sitemapUrls: sitemapUrls.length,
    auditedPages: pages.length,
    passed: assetErrors.length === 0 && pageErrors.length === 0 && invalidHosts.length === 0,
    errors: [...assetErrors, ...invalidHosts.map((url) => `Sitemap URL is outside site host: ${url}`), ...pageErrors],
    warnings,
  };

  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Discovery audit: ${report.passed ? "PASS" : "FAIL"}`);
    console.log(`Sitemap URLs: ${report.sitemapUrls}; pages audited: ${report.auditedPages}`);
    for (const error of report.errors) console.error(`ERROR: ${error}`);
    for (const warning of report.warnings) console.warn(`WARN: ${warning}`);
  }

  if (!report.passed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

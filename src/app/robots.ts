import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const privatePaths = ["/admin", "/api", "/my-page", "/second-page", "/test-page"];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

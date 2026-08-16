import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { pageRepository } from "@/lib/content/page-repository";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/blog", changeFrequency: "daily", priority: 0.86 },
    { path: "/honors-service", changeFrequency: "weekly", priority: 0.84 },
    { path: "/support-center", changeFrequency: "weekly", priority: 0.82 },
    { path: "/testimony", changeFrequency: "weekly", priority: 0.78 },
    { path: "/web3-proof", changeFrequency: "monthly", priority: 0.58 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.32 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.32 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.18 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    changeFrequency,
    priority,
  })) as MetadataRoute.Sitemap;

  const blogPages: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPaths = new Set(staticPages.map((entry) => entry.url));
  const puckPages: MetadataRoute.Sitemap = pageRepository
    .list()
    .filter(({ slug }) => !["my-page", "second-page", "test-page"].includes(slug))
    .map(({ slug }) => ({
      url: `${base}${slug === "homepage" ? "" : `/${slug}`}`,
      changeFrequency: "weekly" as const,
      priority: slug === "homepage" ? 1 : 0.72,
    }))
    .filter((entry) => !staticPaths.has(entry.url));

  return [...staticPages, ...puckPages, ...blogPages];
}

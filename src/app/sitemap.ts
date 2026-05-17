import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

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
    lastModified: now,
    changeFrequency,
    priority,
  })) as MetadataRoute.Sitemap;

  const blogPages: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

import { describe, expect, it } from "vitest";
import { getAllBlogPosts } from "@/lib/blog";
import { getPageData } from "@/lib/get-page-data";
import { getPageSeo } from "@/lib/seo";
import { metadata as blogMetadata } from "@/app/blog/page";
import { metadata as web3ProofMetadata } from "@/app/web3-proof/page";

const indexedPageSlugs = [
  "homepage",
  "honors-service",
  "support-center",
  "testimony",
  "privacy-policy",
  "terms-of-service",
  "terms",
];

function expectSearchReadyMetadata(
  route: string,
  title: string,
  description: string
) {
  expect(title.length, `${route} title is too short`).toBeGreaterThanOrEqual(35);
  expect(title.length, `${route} title is too long`).toBeLessThanOrEqual(80);
  expect(description.length, `${route} description is too short`).toBeGreaterThanOrEqual(120);
  expect(description.length, `${route} description is too long`).toBeLessThanOrEqual(190);
}

describe("search readiness metadata", () => {
  it("keeps indexed Puck pages descriptive for SEO and AI summaries", () => {
    for (const slug of indexedPageSlugs) {
      const seo = getPageSeo(slug, getPageData(slug));
      expectSearchReadyMetadata(slug, seo.title, seo.description);
    }
  });

  it("keeps blog posts descriptive for snippets and answer engines", () => {
    for (const post of getAllBlogPosts()) {
      expectSearchReadyMetadata(
        `/blog/${post.slug}`,
        `${post.title} | Aarti Sri Ravikumar`,
        post.excerpt
      );
    }
  });

  it("keeps route-only pages descriptive for snippets and answer engines", () => {
    expectSearchReadyMetadata(
      "/blog",
      String(blogMetadata.title),
      String(blogMetadata.description)
    );
    expectSearchReadyMetadata(
      "/web3-proof",
      String(web3ProofMetadata.title),
      String(web3ProofMetadata.description)
    );
  });
});

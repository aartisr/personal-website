import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageRepository } from "@/lib/content/page-repository";
import { PuckRenderer } from "@/lib/puck-render";
import { applyGlobalLayout } from "@/lib/global-layout";
import { absoluteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Research Notes & Field Memos | Aarti Sri Ravikumar",
  description:
    "Read research notes and field memos from Aarti Sri Ravikumar on software engineering, resilient learning systems, project execution, and clear academic communication.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Research Notes & Field Memos | Aarti Sri Ravikumar",
    description:
      "Read research notes and field memos from Aarti Sri Ravikumar on software engineering, resilient learning systems, project execution, and clear academic communication.",
    type: "website",
    url: absoluteUrl("/blog"),
    images: [
      {
        url: absoluteUrl(siteProfile.socialImagePath),
        width: 1200,
        height: 630,
        alt: `${siteProfile.name} academic portfolio social card`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Notes & Field Memos | Aarti Sri Ravikumar",
    description:
      "Read research notes and field memos from Aarti Sri Ravikumar on software engineering, resilient learning systems, project execution, and clear academic communication.",
    images: [absoluteUrl(siteProfile.socialImagePath)],
  },
};

export default function BlogPage() {
  const data = pageRepository.get("blog");
  if (!data) notFound();

  const posts = getAllBlogPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/blog")}#webpage`,
    url: absoluteUrl("/blog"),
    name: "Research Notes & Field Memos",
    description: metadata.description,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl("/")}#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PuckRenderer data={applyGlobalLayout(data)} />
    </>
  );
}

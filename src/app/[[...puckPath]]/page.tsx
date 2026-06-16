import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageData, listPages } from "@/lib/get-page-data";
import { resolvePageSlug } from "@/lib/resolve-path";
import { PuckRenderer } from "@/lib/puck-render";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo";
import { applyGlobalLayout } from "@/lib/global-layout";
import { slugToSegments } from "@/lib/page-slug";

type PageProps = {
  params: Promise<{ puckPath?: string[] }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return listPages()
    .filter(({ slug }) => {
      const data = getPageData(slug);
      const content = (data as { content?: unknown } | null)?.content;
      return Array.isArray(content) && content.length > 0;
    })
    .map(({ slug }) => ({
      puckPath: slugToSegments(slug),
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { puckPath } = await params;
  const slug = resolvePageSlug(puckPath);
  const data = getPageData(slug);

  if (!data) {
    return {
      title: "Page Not Found | Aarti Ravikumar",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata(slug, data);
}

export default async function Page({ params }: PageProps) {
  const { puckPath } = await params;
  const slug = resolvePageSlug(puckPath);
  const data = getPageData(slug);

  if (!data) {
    notFound();
  }

  const pageData = applyGlobalLayout(data);
  const jsonLd = buildPageJsonLd(slug, pageData);

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <PuckRenderer data={pageData} />
    </>
  );
}

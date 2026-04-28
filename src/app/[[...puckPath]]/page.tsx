import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageData, listPages } from "@/lib/get-page-data";
import { resolvePageSlug } from "@/lib/resolve-path";
import { PuckRenderer } from "@/lib/puck-render";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo";

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
      puckPath: slug === "homepage" ? [] : [slug],
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

  const jsonLd = buildPageJsonLd(slug, data);

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <PuckRenderer data={data} />
    </>
  );
}

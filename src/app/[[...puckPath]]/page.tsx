import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageData } from "@/lib/get-page-data";
import { hydratePageGithubStats } from "@/lib/github-stats";
import { resolvePageSlug } from "@/lib/resolve-path";
import { PuckRenderer } from "@/lib/puck-render";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ puckPath?: string[] }>;
};

const pageMetadata: Record<string, { title: string; description: string }> = {
  homepage: {
    title: "Evidence-Led Student Resilience Research",
    description:
      "Aarti Sri Ravikumar's research portfolio on Aether, evidence-led kindness, privacy-aware AI, and human-centered student support.",
  },
  testimony: {
    title: "Research Journey",
    description:
      "Aarti Sri Ravikumar's research journey, milestones, and student portfolio progress.",
  },
  "support-center": {
    title: "Contact and Collaboration",
    description:
      "Contact Aarti Sri Ravikumar for research feedback, mentorship, collaboration, and portfolio support.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "Privacy commitments for Aarti Sri Ravikumar's student research portfolio.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description:
      "Usage terms for Aarti Sri Ravikumar's student research portfolio.",
  },
};

function pathForSlug(slug: string) {
  return slug === "homepage" ? "/" : `/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { puckPath } = await params;
  const slug = resolvePageSlug(puckPath);
  const path = pathForSlug(slug);
  const fallbackTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const meta = pageMetadata[slug] ?? {
    title: fallbackTitle,
    description:
      "Aarti Sri Ravikumar's student research portfolio and project documentation.",
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${meta.title} | Aarti Sri Ravikumar`,
      description: meta.description,
      type: "website",
      url: absoluteUrl(path),
      images: [
        {
          url: absoluteUrl("/aether-resilience-hero.svg"),
          width: 1600,
          height: 900,
          alt: "Aether student resilience research map",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Aarti Sri Ravikumar`,
      description: meta.description,
      images: [absoluteUrl("/aether-resilience-hero.svg")],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { puckPath } = await params;
  const slug = resolvePageSlug(puckPath);
  const data = getPageData(slug);

  if (!data) {
    notFound();
  }

  const hydratedData = await hydratePageGithubStats(slug, data);

  return <PuckRenderer data={hydratedData} />;
}

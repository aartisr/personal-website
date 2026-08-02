import type { Metadata } from "next";
import type { Data } from "@puckeditor/core";
import { absoluteUrl } from "@/lib/site";

type PuckBlock = {
  type?: string;
  props?: Record<string, unknown>;
};

type JsonLd = Record<string, unknown>;

export const siteProfile = {
  name: "Aarti Sri Ravikumar",
  shortName: "Aarti Ravikumar",
  title: "Aarti Sri Ravikumar | Student Research Portfolio",
  description:
    "Academic student research portfolio for evidence-led software projects, resilient learning systems, technical writing, and collaboration.",
  school: "Pioneer Charter School of Science II",
  location: "Saugus, Massachusetts",
  githubUrl: "https://github.com/aartisr",
  avatarUrl: "https://avatars.githubusercontent.com/u/166765628?v=4",
  socialImagePath: "/opengraph-image",
  language: "en-US",
  keywords: [
    "Aarti Sri Ravikumar",
    "student research portfolio",
    "academic portfolio",
    "software engineering student",
    "research projects",
    "technical writing",
    "Pioneer Charter School of Science II",
    "Saugus Massachusetts",
  ],
};

function getBlocks(data: Data | null): PuckBlock[] {
  const content = (data as { content?: unknown } | null)?.content;
  return Array.isArray(content) ? (content as PuckBlock[]) : [];
}

function getRootProps(data: Data | null): Record<string, unknown> {
  const rootProps = (data as { root?: { props?: unknown } } | null)?.root?.props;
  return rootProps && typeof rootProps === "object"
    ? (rootProps as Record<string, unknown>)
    : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function textFromProps(
  props: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = text(props[key]);
    if (value) {
      return value;
    }
  }

  return "";
}

function titleFromSlug(slug: string): string {
  if (slug === "homepage") {
    return siteProfile.title;
  }

  return slug
    .replace(/\//g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pathFromSlug(slug: string): string {
  return slug === "homepage" ? "/" : `/${slug}`;
}

function findBlock(data: Data | null, type: string): PuckBlock | null {
  return getBlocks(data).find((block) => block?.type === type) ?? null;
}

function normalizeTitle(slug: string, title: string): string {
  if (slug === "homepage") {
    return title || siteProfile.title;
  }

  if (!title) {
    return `${titleFromSlug(slug)} | ${siteProfile.shortName}`;
  }

  return title.includes(siteProfile.shortName)
    ? title
    : `${title} | ${siteProfile.shortName}`;
}

export function getPageSeo(slug: string, data: Data | null) {
  const rootProps = getRootProps(data);
  const heroProps = findBlock(data, "HeroSection")?.props ?? {};
  const path = pathFromSlug(slug);
  const title =
    textFromProps(rootProps, ["seoTitle", "metaTitle", "title"]) ||
    text(heroProps.heading) ||
    titleFromSlug(slug);
  const description =
    textFromProps(rootProps, ["seoDescription", "description"]) ||
    text(heroProps.description) ||
    siteProfile.description;
  const image =
    textFromProps(rootProps, ["seoImage", "image"]) ||
    siteProfile.socialImagePath;
  const keywords = textFromProps(rootProps, ["keywords"])
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title: normalizeTitle(slug, title),
    description,
    path,
    url: absoluteUrl(path),
    image: image.startsWith("http") ? image : absoluteUrl(image),
    keywords: keywords.length > 0 ? keywords : siteProfile.keywords,
  };
}

export function buildPageMetadata(slug: string, data: Data | null): Metadata {
  const seo = getPageSeo(slug, data);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.path,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: slug === "homepage" ? "profile" : "website",
      url: seo.url,
      siteName: siteProfile.name,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: `${siteProfile.name} academic portfolio social card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

function buildBreadcrumbJsonLd(slug: string, url: string): JsonLd {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
  ];

  if (slug !== "homepage") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: titleFromSlug(slug),
      item: url,
    });
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildFaqJsonLd(data: Data | null): JsonLd | null {
  const faqBlock = findBlock(data, "FAQSection");
  const faqs = faqBlock?.props?.faqs;

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  const mainEntity = faqs
    .map((faq) => {
      const question = text((faq as { question?: unknown })?.question);
      const answer = text((faq as { answer?: unknown })?.answer);

      if (!question || !answer) {
        return null;
      }

      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      };
    })
    .filter(Boolean);

  if (mainEntity.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

function buildResearchItemListJsonLd(data: Data | null): JsonLd | null {
  const researchBlock = findBlock(data, "ResearchShowcase");
  const items = researchBlock?.props?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const itemListElement = items
    .map((item, index) => {
      const title = text((item as { title?: unknown })?.title);
      const description = text((item as { description?: unknown })?.description);
      const href = text((item as { href?: unknown })?.href);

      if (!title) {
        return null;
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: title,
          description,
          url: href ? (href.startsWith("http") ? href : absoluteUrl(href)) : undefined,
        },
      };
    })
    .filter(Boolean);

  if (itemListElement.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Academic research and project evidence",
    itemListElement,
  };
}

export function buildPageJsonLd(slug: string, data: Data | null): JsonLd[] {
  const seo = getPageSeo(slug, data);
  const graph: Array<JsonLd | null> = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      name: siteProfile.title,
      alternateName: siteProfile.shortName,
      url: absoluteUrl("/"),
      description: siteProfile.description,
      inLanguage: siteProfile.language,
      publisher: {
        "@id": `${absoluteUrl("/")}#person`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: siteProfile.name,
      alternateName: siteProfile.shortName,
      url: absoluteUrl("/"),
      image: siteProfile.avatarUrl,
      sameAs: [siteProfile.githubUrl],
      nationality: "US",
      homeLocation: {
        "@type": "Place",
        name: siteProfile.location,
      },
      affiliation: {
        "@type": "EducationalOrganization",
        name: siteProfile.school,
        address: siteProfile.location,
      },
      knowsAbout: [
        "student research",
        "software engineering",
        "technical writing",
        "resilient learning systems",
        "academic portfolio",
        "generative AI search readiness",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": slug === "homepage" ? "ProfilePage" : "WebPage",
      "@id": `${seo.url}#webpage`,
      url: seo.url,
      name: seo.title,
      description: seo.description,
      inLanguage: siteProfile.language,
      keywords: seo.keywords.join(", "),
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: seo.image,
      },
      isPartOf: {
        "@id": `${absoluteUrl("/")}#website`,
      },
      about: {
        "@id": `${absoluteUrl("/")}#person`,
      },
      ...(slug === "homepage"
        ? {
            mainEntity: {
              "@id": `${absoluteUrl("/")}#person`,
            },
          }
        : {}),
      breadcrumb: buildBreadcrumbJsonLd(slug, seo.url),
    },
    buildFaqJsonLd(data),
    buildResearchItemListJsonLd(data),
  ];

  return graph.filter((entry): entry is JsonLd => Boolean(entry));
}

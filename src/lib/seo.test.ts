import { describe, expect, it, vi, afterEach } from "vitest";
import type { Data } from "@puckeditor/core";
import {
  buildPageJsonLd,
  buildPageMetadata,
  getPageSeo,
} from "@/lib/seo";

afterEach(() => {
  vi.unstubAllEnvs();
});

function makeData(): Data {
  return {
    root: {
      props: {
        title: "Research Profile",
        description: "A focused academic research profile.",
      },
    },
    content: [
      {
        type: "ResearchShowcase",
        props: {
          items: [
            {
              title: "Student Resiliency Framework",
              description: "Evidence-led learning systems research.",
              href: "/aether-student-resiliency-framework-2026.pdf",
            },
          ],
        },
      },
      {
        type: "FAQSection",
        props: {
          faqs: [
            {
              question: "What does this portfolio show?",
              answer: "It shows research, projects, and writing.",
            },
          ],
        },
      },
    ],
  } as Data;
}

describe("SEO helpers", () => {
  it("derives canonical page SEO from Puck root props", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu/");

    expect(getPageSeo("testimony", makeData())).toMatchObject({
      title: "Research Profile | Aarti Ravikumar",
      description: "A focused academic research profile.",
      path: "/testimony",
      url: "https://example.edu/testimony",
    });
  });

  it("builds social metadata with a large image card", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu");

    const metadata = buildPageMetadata("homepage", makeData());

    expect(metadata.openGraph).toMatchObject({
      type: "profile",
      siteName: "Aarti Sri Ravikumar",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });

  it("keeps the legacy terms URL out of search results", () => {
    const metadata = buildPageMetadata("terms", makeData());

    expect(metadata.alternates).toMatchObject({ canonical: "/terms-of-service" });
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("includes FAQ and research item structured data when present", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu");

    const graph = buildPageJsonLd("homepage", makeData());

    expect(graph.some((entry) => entry["@type"] === "FAQPage")).toBe(true);
    expect(graph.some((entry) => entry["@type"] === "ItemList")).toBe(true);
  });

  it("connects each page to the canonical site and person entities", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.edu");

    const graph = buildPageJsonLd("homepage", makeData());
    const profile = graph.find((entry) => entry["@type"] === "ProfilePage");

    expect(profile).toMatchObject({
      isPartOf: { "@id": "https://example.edu/#website" },
      about: { "@id": "https://example.edu/#person" },
    });
  });
});

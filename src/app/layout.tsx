import type { Metadata } from "next";
import "./globals.css";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const heroImage = absoluteUrl("/aether-resilience-hero.svg");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aarti Sri Ravikumar | Evidence-Led Student Resilience Research",
    template: "%s | Aarti Sri Ravikumar",
  },
  description:
    "Aarti Sri Ravikumar's research portfolio on evidence-led kindness, student resilience, privacy-aware AI, and human-centered support systems.",
  keywords: [
    "Aarti Sri Ravikumar",
    "student resilience research",
    "Aether student resiliency ecosystem",
    "evidence-led kindness",
    "student mental health research",
    "privacy-aware AI",
    "academic portfolio",
    "student researcher",
  ],
  authors: [{ name: "Aarti Sri Ravikumar", url: siteUrl }],
  creator: "Aarti Sri Ravikumar",
  publisher: "Aarti Sri Ravikumar",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aarti Sri Ravikumar | Evidence-Led Student Resilience Research",
    description:
      "Explore Aether, a student-authored research framework connecting belonging, reflection, privacy-aware AI, and human care.",
    url: siteUrl,
    siteName: "Aarti Sri Ravikumar",
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1600,
        height: 900,
        alt: "Aether student resilience research map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aarti Sri Ravikumar | Evidence-Led Student Resilience Research",
    description:
      "Student research on evidence-led kindness, resilience, privacy-aware AI, and human-centered support systems.",
    images: [heroImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Aarti Sri Ravikumar",
      url: siteUrl,
      image: "https://avatars.githubusercontent.com/u/166765628?v=4",
      sameAs: ["https://github.com/aartisr"],
      affiliation: {
        "@type": "EducationalOrganization",
        name: "Pioneer Charter School of Science II",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Saugus",
          addressRegion: "MA",
          addressCountry: "US",
        },
      },
      knowsAbout: [
        "student resilience",
        "evidence-led kindness",
        "privacy-aware AI",
        "human-centered systems",
        "academic research communication",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Aarti Sri Ravikumar",
      url: siteUrl,
      description:
        "A research portfolio about evidence-led kindness, student resilience, and responsible technical systems.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "CreativeWork",
      "@id": `${siteUrl}/#aether`,
      name: "Aether: The Student Resiliency Ecosystem",
      url: absoluteUrl("/aether-student-resiliency-framework-2026.pdf"),
      creator: {
        "@id": `${siteUrl}/#person`,
      },
      about: [
        "student resilience",
        "school connectedness",
        "privacy-aware AI",
        "human handoff",
        "kindness in systems design",
      ],
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}

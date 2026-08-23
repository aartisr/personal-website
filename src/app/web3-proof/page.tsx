import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageRepository } from "@/lib/content/page-repository";
import { PuckRenderer } from "@/lib/puck-render";
import { applyGlobalLayout } from "@/lib/global-layout";
import { absoluteUrl } from "@/lib/site";
import { buildPageJsonLd, siteProfile } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Wallet Authenticity Proof for Student Portfolio | Aarti Sri Ravikumar",
  description:
    "Verify wallet-based authenticity proof for Aarti Sri Ravikumar's student research portfolio using cryptographic signature checks and transparent identity signals.",
  alternates: {
    canonical: "/web3-proof",
  },
  openGraph: {
    title: "Wallet Authenticity Proof for Student Portfolio | Aarti Sri Ravikumar",
    description:
      "Verify wallet-based authenticity proof for Aarti Sri Ravikumar's student research portfolio using cryptographic signature checks and transparent identity signals.",
    type: "website",
    url: absoluteUrl("/web3-proof"),
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
    title: "Wallet Authenticity Proof for Student Portfolio | Aarti Sri Ravikumar",
    description:
      "Verify wallet-based authenticity proof for Aarti Sri Ravikumar's student research portfolio using cryptographic signature checks and transparent identity signals.",
    images: [absoluteUrl(siteProfile.socialImagePath)],
  },
};

export default function Web3ProofPage() {
  const data = pageRepository.get("web3-proof");
  if (!data) notFound();

  const pageData = applyGlobalLayout(data);
  const jsonLd = buildPageJsonLd("web3-proof", pageData);

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

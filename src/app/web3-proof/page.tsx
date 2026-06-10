import Link from "next/link";
import type { Metadata } from "next";
import { WalletProofClient } from "@/components/web3/wallet-proof-client";
import { absoluteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/seo";

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
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-[color:var(--primary)]"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
          Authenticity Proof
        </h1>

        <p className="mt-3 text-base text-[color:var(--muted-foreground)]">
          This page provides a practical identity signal: wallet control plus cryptographic signature proof.
        </p>

        <div className="mt-8">
          <WalletProofClient />
        </div>
      </div>
    </main>
  );
}

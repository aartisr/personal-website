import type { Metadata } from "next";
import "./globals.css";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { getSiteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteProfile.name,
  title: siteProfile.title,
  description: siteProfile.description,
  keywords: siteProfile.keywords,
  authors: [{ name: siteProfile.name, url: getSiteUrl() }],
  creator: siteProfile.name,
  publisher: siteProfile.name,
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteProfile.title,
    description: siteProfile.description,
    type: "website",
    siteName: siteProfile.name,
    images: [
      {
        url: siteProfile.socialImagePath,
        width: 1200,
        height: 630,
        alt: `${siteProfile.name} academic portfolio social card`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteProfile.title,
    description: siteProfile.description,
    images: [siteProfile.socialImagePath],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteProfile.name} research notes RSS feed`}
          href="/blog/rss.xml"
        />
      </head>
      <body className="antialiased">
        <main id="main-content">{children}</main>
        <MicrosoftClarity />
      </body>
    </html>
  );
}

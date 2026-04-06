import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Aarti Sri Ravikumar | Student Portfolio",
  description:
    "Student personal website showcasing projects, research, and open-source collaboration.",
  openGraph: {
    title: "Aarti Sri Ravikumar | Student Portfolio",
    description:
      "Explore Aarti's projects, contributions, and learning journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}

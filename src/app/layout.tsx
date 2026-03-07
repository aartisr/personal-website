import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="antialiased">{children}</body>
    </html>
  );
}

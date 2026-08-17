import type { Metadata } from "next";

/**
 * The visual editor is a private operational surface, not public content.
 * Keeping it out of search results also prevents crawlers from evaluating its
 * client-side loading states as indexable pages.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

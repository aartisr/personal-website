import { Analytics } from "@vercel/analytics/next";

/**
 * Vercel Analytics wrapper.
 * The package is declared in package.json and installed automatically by Vercel
 * during deployment. To use locally run: pnpm install
 */
export function VercelAnalytics() {
  return <Analytics />;
}

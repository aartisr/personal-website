import { Analytics } from "@vercel/analytics/next";
import { MicrosoftClarity } from "./microsoft-clarity";

/**
 * Generic analytics provider — the single place to register all analytics tools.
 *
 * To add a new analytics integration:
 *   1. Create its component in this directory (e.g. `google-analytics.tsx`)
 *   2. Import and add it below — nothing else needs to change
 *
 * To remove an integration: delete its line. `layout.tsx` never needs editing.
 */
export function AnalyticsProvider() {
  return (
    <>
      <MicrosoftClarity />
      <Analytics />
    </>
  );
}

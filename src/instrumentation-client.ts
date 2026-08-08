import posthog from "posthog-js";
import { getPostHogConfig } from "@/lib/posthog";

// Next.js loads this browser-only entry point before the application hydrates.
// Keeping PostHog here avoids duplicate initialization across layouts and routes.
const config = getPostHogConfig();

if (config && !posthog.__loaded) {
  posthog.init(config.projectToken, {
    api_host: config.host,
    // Enables PostHog's current web defaults, including App Router navigation
    // pageviews, while leaving product-level capture controls in PostHog.
    defaults: "2026-05-30",
  });
}

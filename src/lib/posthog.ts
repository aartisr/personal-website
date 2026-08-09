export const postHogProjectTokenEnvVar = "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
export const postHogHostEnvVar = "NEXT_PUBLIC_POSTHOG_HOST";
export const postHogEnabledEnvVar = "NEXT_PUBLIC_POSTHOG_ENABLED";

const defaultPostHogHost = "https://us.i.posthog.com";

export type PostHogConfig = {
  projectToken: string;
  host: string;
};

function isExplicitlyDisabled(value: string | undefined): boolean {
  return ["0", "false", "no", "off"].includes(value?.trim().toLowerCase() ?? "");
}

function normalizeHost(value: string | undefined): string | null {
  const candidate = value?.trim() || defaultPostHogHost;

  try {
    const url = new URL(candidate);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Returns the public PostHog browser configuration, or null when analytics is
 * intentionally unavailable. Keeping this check here makes local, preview, and
 * production environments safe to configure independently.
 */
export function getPostHogConfig(): PostHogConfig | null {
  // Keep these as direct references. Next.js only inlines NEXT_PUBLIC_* values
  // into browser bundles when their property names are statically known.
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();

  if (!projectToken || isExplicitlyDisabled(process.env.NEXT_PUBLIC_POSTHOG_ENABLED)) {
    return null;
  }

  const host = normalizeHost(process.env.NEXT_PUBLIC_POSTHOG_HOST);

  return host ? { projectToken, host } : null;
}

/**
 * Produces a JSON value that is safe to interpolate into an inline script.
 * Environment variables are deployment input, so this prevents a malformed
 * value from ending the script element early.
 */
export function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

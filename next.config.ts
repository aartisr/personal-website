import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";
const buildOutputDirectory = process.env.NEXT_BUILD_OUTPUT_DIR?.trim() || ".next";
const configuredPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();

function getCspSource(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

const postHogCspSource = getCspSource(configuredPostHogHost);
const postHogScriptSources = ["https://*.posthog.com", postHogCspSource]
  .filter((source): source is string => Boolean(source))
  .join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  `script-src 'self' 'unsafe-inline' https://www.clarity.ms ${postHogScriptSources}${isDevelopment ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'${isDevelopment ? " https: data: blob:" : ""}`,
  `style-src-elem 'self' 'unsafe-inline'${isDevelopment ? " https: data: blob:" : ""}`,
  `connect-src 'self' https: ${postHogScriptSources}${isDevelopment ? " ws: wss:" : ""}`,
  "worker-src 'self' blob: data:",
  "object-src 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: buildOutputDirectory,
  transpilePackages: ["@kindoms/shared-ui"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/aether-student-resiliency-framework-2026.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/opengraph-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/api/github-stats",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: isDevelopment
              ? "max-age=0"
              : "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

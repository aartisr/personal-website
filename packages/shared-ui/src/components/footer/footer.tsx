import React from "react";
import "./footer.css";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type FooterProps = {
  logo: string;
  logoAlt: string;
  columns: FooterColumn[];
  copyright: string;
  socialLinks: SocialLink[];
};

type NormalizedFooterLink = {
  label: string;
  href: string;
};

type NormalizedFooterColumn = {
  title: string;
  links: NormalizedFooterLink[];
};

type NormalizedSocialLink = {
  platform: string;
  url: string;
};

const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18A10.86 10.86 0 0 1 12 6.03c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.78 1.07.78 2.16v3.13c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
};

function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  return (
    <>{socialIcons[key] ?? <span className="text-xs font-bold">{platform.slice(0, 2).toUpperCase()}</span>}</>
  );
}

function resolveCopyright(text: string): string {
  return text.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
}

function toText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function sanitizeHref(rawHref: unknown): string {
  const href = toText(rawHref);
  if (!href) return "#";
  if (href.startsWith("/")) return href;
  if (href.startsWith("#")) return href;
  if (href.startsWith("mailto:")) return href;
  if (href.startsWith("tel:")) return href;

  try {
    const url = new URL(href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return href;
    }
  } catch {
    return "#";
  }

  return "#";
}

function normalizeColumns(value: unknown): NormalizedFooterColumn[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((column) => {
      const title = toText((column as { title?: unknown })?.title, "Resources");
      const rawLinks = (column as { links?: unknown })?.links;
      const links = Array.isArray(rawLinks)
        ? rawLinks
            .map((link) => {
              const label = toText((link as { label?: unknown })?.label);
              const href = sanitizeHref((link as { href?: unknown })?.href);
              if (!label) return null;
              return { label, href };
            })
            .filter((link): link is NormalizedFooterLink => Boolean(link))
        : [];

      if (!title && links.length === 0) return null;
      return { title: title || "Resources", links };
    })
    .filter((column): column is NormalizedFooterColumn => Boolean(column));
}

function normalizeSocialLinks(value: unknown): NormalizedSocialLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((social) => {
      const platform = toText((social as { platform?: unknown })?.platform);
      const url = sanitizeHref((social as { url?: unknown })?.url);
      if (!platform) return null;
      return { platform, url };
    })
    .filter((social): social is NormalizedSocialLink => Boolean(social));
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function getQuickHelpLink(columns: NormalizedFooterColumn[]): NormalizedFooterLink | null {
  const priorityWords = ["support", "help", "contact", "book", "demo"];

  for (const column of columns) {
    for (const link of column.links) {
      const combined = `${column.title} ${link.label}`.toLowerCase();
      if (priorityWords.some((word) => combined.includes(word))) {
        return link;
      }
    }
  }

  return null;
}

const trustHighlights = [
  "Evidence over hype",
  "Privacy-aware collaboration",
  "Kindness as a design constraint",
];

export function Footer({
  logo,
  logoAlt,
  columns,
  copyright,
  socialLinks,
}: FooterProps) {
  const normalizedColumns = normalizeColumns(columns);
  const normalizedSocialLinks = normalizeSocialLinks(socialLinks);
  const helpLink = getQuickHelpLink(normalizedColumns);

  return (
    <footer
      className="w-full pt-16 pb-8 px-4 footer"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 id="footer-heading" className="sr-only">Site footer</h2>

        {helpLink && (
          <div className="mb-7 rounded-lg px-4 py-4 sm:px-5 sm:py-4 footer-help-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm sm:text-[0.95rem] footer-help-copy">
                Need quick help before you leave?
              </p>
              <a
                href={helpLink.href}
                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold footer-help-cta"
              >
                {helpLink.label}
              </a>
            </div>
          </div>
        )}

        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Trust highlights">
          {trustHighlights.map((item) => (
            <div key={item} className="rounded-lg px-4 py-3 footer-trust-item">
              <p className="text-xs sm:text-[0.8rem] font-medium footer-trust-item-text">{item}</p>
            </div>
          ))}
        </div>

        {/* Top section: logo + columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {logo && (
              <img
                src={logo}
                alt={logoAlt || "Logo"}
                className="h-9 w-auto mb-4 object-contain"
              />
            )}
            {/* Social links */}
            {normalizedSocialLinks.length > 0 && (
              <div className="flex gap-3 mt-2">
                {normalizedSocialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target={isExternalHref(social.url) ? "_blank" : undefined}
                    rel={isExternalHref(social.url) ? "noopener noreferrer" : undefined}
                    aria-label={`${social.platform} profile`}
                    className="flex items-center justify-center w-9 h-9 rounded-full footer-social-link"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {normalizedColumns.map((col, colIndex) => (
            <div key={colIndex}>
              <h3 className="text-xs font-semibold uppercase mb-4 footer-column-title">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      target={isExternalHref(link.href) ? "_blank" : undefined}
                      rel={isExternalHref(link.href) ? "noopener noreferrer" : undefined}
                      className="text-sm footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 footer-bottom-bar">
          <p className="text-xs footer-copyright">
            {resolveCopyright(toText(copyright, "© 2026 All rights reserved."))}
          </p>
          <a href="#main-content" className="text-xs font-medium footer-back-to-top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

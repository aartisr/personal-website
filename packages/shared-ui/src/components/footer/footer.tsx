"use client";

import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Facebook,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  MapPin,
  ScrollText,
  ShieldCheck,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
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

export type FooterAction = {
  label: string;
  href: string;
};

export type FooterHighlight = string | { text?: string };

export type FooterProps = {
  logo: string;
  logoAlt: string;
  brandName?: string;
  eyebrow?: string;
  tagline?: string;
  affiliation?: string;
  location?: string;
  citation?: string;
  availability?: string;
  primaryAction?: FooterAction;
  secondaryAction?: FooterAction;
  highlights?: FooterHighlight[];
  utilityLinks?: FooterLink[];
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

type PhilosophySection = {
  title: string;
  body: string;
  points: string[];
};

const logoPhilosophySections: PhilosophySection[] = [
  {
    title: "The Infinity Symbol (∞)",
    body: "Boundless learning, continuity, and connection between ideas, mentors, and collaborators.",
    points: [
      "No ceiling on intellectual growth.",
      "Knowledge flows across disciplines and generations.",
      "The two lobes represent distinct paths joined by one center.",
    ],
  },
  {
    title: "The Zero (0) at the Center",
    body: "The paradox of emptiness and completeness: the origin point where humility and discovery meet.",
    points: [
      "Inquiry begins with unknowing.",
      "Potential emerges from stillness.",
      "Origin and return are part of one cycle.",
    ],
  },
  {
    title: "Aarti Flames",
    body: "Sacred light that symbolizes compassion, service, and enlightenment through practice.",
    points: [
      "Top flame: rising aspiration and kindness.",
      "Bottom flame: grounded wisdom and application.",
      "Together they balance spiritual and academic purpose.",
    ],
  },
  {
    title: "Ravi: Solar Rays",
    body: "Eight rays convey illumination, reliability, and universal reach.",
    points: [
      "Knowledge reveals what was hidden.",
      "Clarity should travel in every direction.",
      "Energy, consistency, and trustworthiness define the work.",
    ],
  },
  {
    title: "Kindness and Elegance",
    body: "Gentle curves and measured geometry encode accessibility with rigor.",
    points: [
      "Compassion improves comprehension.",
      "Precision and openness can coexist.",
      "Academic excellence should remain human-centered.",
    ],
  },
];

const unifiedMessage =
  "Knowledge is boundless, kindness is the path, and enlightenment emerges from the sacred balance of rising aspiration and grounded wisdom. All are included.";

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  const Icon = socialIcons[key];
  return (
    <>
      {Icon ? (
        <Icon size={18} aria-hidden="true" />
      ) : (
        <span className="text-xs font-bold">{platform.slice(0, 2).toUpperCase()}</span>
      )}
    </>
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

function normalizeAction(value: unknown): NormalizedFooterLink | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const label = toText((value as { label?: unknown })?.label);
  const href = sanitizeHref((value as { href?: unknown })?.href);
  return label ? { label, href } : null;
}

function normalizeHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item : toText((item as { text?: unknown })?.text)))
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeUtilityLinks(
  utilityLinks: unknown,
  columns: NormalizedFooterColumn[]
): NormalizedFooterLink[] {
  if (Array.isArray(utilityLinks)) {
    const normalized = utilityLinks
      .map((link) => {
        const label = toText((link as { label?: unknown })?.label);
        const href = sanitizeHref((link as { href?: unknown })?.href);
        return label ? { label, href } : null;
      })
      .filter((link): link is NormalizedFooterLink => Boolean(link));

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return columns
    .flatMap((column) => column.links)
    .filter((link) =>
      /privacy|terms|support|accessibility/i.test(`${link.label} ${link.href}`)
    )
    .slice(0, 4);
}

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function getPriorityLink(columns: NormalizedFooterColumn[]): NormalizedFooterLink | null {
  const priorityWords = ["support", "collaboration", "contact", "research", "github"];

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

export function Footer({
  logo,
  logoAlt,
  brandName,
  eyebrow,
  tagline,
  affiliation,
  location,
  citation,
  availability,
  primaryAction,
  secondaryAction,
  highlights,
  utilityLinks,
  columns,
  copyright,
  socialLinks,
}: FooterProps) {
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);

  const normalizedColumns = normalizeColumns(columns);
  const normalizedSocialLinks = normalizeSocialLinks(socialLinks);
  const priorityLink = getPriorityLink(normalizedColumns);
  const mainAction = normalizeAction(primaryAction) ?? priorityLink;
  const secondary = normalizeAction(secondaryAction);
  const normalizedHighlights = normalizeHighlights(highlights);
  const normalizedUtilityLinks = normalizeUtilityLinks(utilityLinks, normalizedColumns);
  const resolvedBrandName = toText(brandName, logoAlt || "Academic portfolio");
  const resolvedEyebrow = toText(eyebrow, "Student Research Portfolio");
  const resolvedTagline = toText(
    tagline,
    "Evidence-led research, software, and technical writing presented for reviewers, mentors, and collaborators."
  );

  useEffect(() => {
    if (!isPhilosophyOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPhilosophyOpen(false);
      }
    };

    document.body.classList.add("footer-modal-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("footer-modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isPhilosophyOpen]);

  return (
    <footer
      role="contentinfo"
      className="w-full px-4 pb-8 pt-16 sm:pt-18 footer"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 id="footer-heading" className="sr-only">
          Site footer
        </h2>

        <div className="footer-thesis">
          <div className="footer-thesis-main">
            <p className="footer-eyebrow">{resolvedEyebrow}</p>
            <p className="footer-thesis-title">
              A closing map for readers who want the work, the evidence, and the next step.
            </p>
            <p className="footer-thesis-copy">{resolvedTagline}</p>
          </div>
          {(mainAction || secondary) && (
            <div className="footer-thesis-actions">
              {mainAction && (
                <a href={mainAction.href} className="footer-primary-action">
                  {mainAction.label}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              {secondary && (
                <a
                  href={secondary.href}
                  target={isExternalHref(secondary.href) ? "_blank" : undefined}
                  rel={isExternalHref(secondary.href) ? "noopener noreferrer" : undefined}
                  className="footer-secondary-action"
                >
                  {secondary.label}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="footer-identity-grid">
          <section className="footer-identity-panel" aria-label="Academic identity">
            <div className="footer-brand-row">
              {logo && (
                <div className="footer-logo-shell">
                  <button
                    type="button"
                    className="footer-logo-trigger"
                    onClick={() => setIsPhilosophyOpen(true)}
                    aria-haspopup="dialog"
                    aria-label="Open logo philosophy"
                  >
                    <img
                      src={logo}
                      alt={logoAlt || resolvedBrandName}
                      className="footer-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <div className="footer-logo-preview" aria-hidden="true">
                    <div className="footer-logo-preview-card">
                      <img
                        src={logo}
                        alt=""
                        className="footer-logo-preview-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <p className="footer-brand-name">{resolvedBrandName}</p>
                {affiliation && (
                  <p className="footer-brand-meta">
                    <GraduationCap size={15} aria-hidden="true" />
                    {affiliation}
                  </p>
                )}
                {location && (
                  <p className="footer-brand-meta">
                    <MapPin size={15} aria-hidden="true" />
                    {location}
                  </p>
                )}
              </div>
            </div>

            {normalizedHighlights.length > 0 && (
              <ul className="footer-highlight-list" aria-label="Research focus">
                {normalizedHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {normalizedSocialLinks.length > 0 && (
              <div className="footer-social-list" aria-label="Social and research profiles">
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
          </section>

          <section className="footer-note-panel" aria-label="Reviewer note">
            {availability && (
              <p className="footer-note-line">
                <BookOpen size={16} aria-hidden="true" />
                {availability}
              </p>
            )}
            {citation && (
              <div className="footer-citation">
                <p className="footer-citation-label">
                  <ScrollText size={15} aria-hidden="true" />
                  Preferred citation
                </p>
                <p>{citation}</p>
              </div>
            )}
            <p className="footer-note-line">
              <ShieldCheck size={16} aria-hidden="true" />
              Built for accessibility, fast scanning, and clear academic attribution.
            </p>
          </section>
        </div>

        <nav className="footer-link-grid" aria-label="Footer navigation">
          {normalizedColumns.map((col, colIndex) => (
            <div key={colIndex}>
              <h3 className="footer-column-title">{col.title}</h3>
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
                      {isExternalHref(link.href) && (
                        <ExternalLink size={12} aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 footer-bottom-bar">
          <p className="text-xs footer-copyright">
            {resolveCopyright(toText(copyright, "© 2026 All rights reserved."))}
          </p>
          <div className="footer-utility-row">
            {normalizedUtilityLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href} className="footer-utility-link">
                {link.label}
              </a>
            ))}
            <a href="#main-content" className="footer-back-to-top">
              Back to top
            </a>
          </div>
        </div>
      </div>

      {isPhilosophyOpen && (
        <div
          className="footer-philosophy-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-philosophy-title"
          onClick={() => setIsPhilosophyOpen(false)}
        >
          <section
            className="footer-philosophy-card"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="footer-philosophy-header">
              <div>
                <p className="footer-philosophy-eyebrow">Logo Philosophy</p>
                <h3 id="footer-philosophy-title" className="footer-philosophy-title">
                  The Logo: A Symbol of All Inclusive Aarti
                </h3>
              </div>
              <button
                type="button"
                className="footer-philosophy-close"
                onClick={() => setIsPhilosophyOpen(false)}
                aria-label="Close logo philosophy"
              >
                Close
              </button>
            </header>

            <blockquote className="footer-philosophy-message">
              {unifiedMessage}
            </blockquote>

            <div className="footer-philosophy-grid">
              {logoPhilosophySections.map((section) => (
                <article key={section.title} className="footer-philosophy-section">
                  <h4>{section.title}</h4>
                  <p>{section.body}</p>
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </footer>
  );
}

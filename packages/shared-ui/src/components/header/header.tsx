"use client";

import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { isExternalHref, normalizeLink } from "../../utils/links";
import "./header.css";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type CtaButton = {
  label: string;
  href: string;
};

export type HeaderUtilityLink = {
  label: string;
  href: string;
};

export type NavStyle = "flat" | "dropdown" | "mega";

export type HeaderProps = {
  logo: string;
  logoHref?: string;
  logoAlt: string;
  brandName?: string;
  brandSubtext?: string;
  eyebrow?: string;
  affiliation?: string;
  location?: string;
  statusLabel?: string;
  navItems: NavItem[];
  ctaButton: CtaButton;
  secondaryCta?: CtaButton;
  utilityLinks?: HeaderUtilityLink[];
  sticky: boolean;
  navStyle?: NavStyle;
  showReadingProgress?: boolean;
};

type NormalizedLink = ReturnType<typeof normalizeLink> extends infer Link
  ? Exclude<Link, null>
  : never;

function normalizeAction(value: unknown): NormalizedLink | null {
  return normalizeLink(value);
}

function normalizeUtilityLinks(value: unknown): NormalizedLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((link) => normalizeAction(link))
    .filter((link): link is NormalizedLink => Boolean(link))
    .slice(0, 3);
}

function anchorIdFromHref(href: string): string | null {
  const [, hashPart] = href.split("#");
  const anchorId = hashPart?.trim();
  return anchorId || null;
}

function isHomeAnchor(href: string): boolean {
  const [pathPart, hashPart] = href.split("#");
  return Boolean(hashPart) && (pathPart === "" || pathPart === "/");
}

function scrollToAnchor(
  anchorId: string,
  behavior: ScrollBehavior = "smooth",
  attempt = 0
) {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById(anchorId);

  if (target) {
    target.scrollIntoView({ behavior, block: "start" });

    if (window.location.hash !== `#${anchorId}`) {
      window.history.replaceState(null, "", `/#${anchorId}`);
    }

    return;
  }

  if (attempt < 12) {
    window.setTimeout(() => scrollToAnchor(anchorId, behavior, attempt + 1), 90);
  }
}

function UtilityLinkIcon({ href, label }: NormalizedLink) {
  const text = `${label} ${href}`.toLowerCase();
  if (text.includes("github")) return <Github size={14} aria-hidden="true" />;
  if (text.includes("pdf") || text.includes("framework")) {
    return <FileText size={14} aria-hidden="true" />;
  }
  return <ExternalLink size={14} aria-hidden="true" />;
}

function DesktopDropdown({ children }: { children: NavItem[] }) {
  return (
    <div className="academic-header-dropdown">
      <div className="academic-header-dropdown-panel">
        {children.map((child) => (
          <a key={child.href} href={child.href} className="academic-header-dropdown-link">
            {child.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function DesktopMegaMenu({ items }: { items: NavItem[] }) {
  const groupedItems = {
    research: items.filter((item) => /research|method|project|writing|blog/i.test(item.label)),
    profile: items.filter((item) => /about|journey|proof|bio|cv/i.test(item.label)),
    connect: items.filter((item) => /contact|support|collaborat|get in touch/i.test(item.label)),
  };

  const remainder = items.filter(
    (item) =>
      !groupedItems.research.includes(item) &&
      !groupedItems.profile.includes(item) &&
      !groupedItems.connect.includes(item),
  );

  const columns = [
    { heading: "Research", links: groupedItems.research },
    { heading: "Profile", links: groupedItems.profile },
    { heading: "Connect", links: groupedItems.connect },
    { heading: "More", links: remainder },
  ].filter((column) => column.links.length > 0);

  return (
    <div className="academic-header-mega">
      <div className="academic-header-mega-panel">
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="academic-header-mega-heading">{column.heading}</p>
            <div className="space-y-1">
              {column.links.map((child) => (
                <a key={child.href} href={child.href} className="academic-header-dropdown-link">
                  {child.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileAccordion({
  item,
  onNavigate,
  active,
}: {
  item: NavItem;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
  active: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <a
        href={item.href}
        className={`academic-mobile-link ${active(item.href) ? "is-active" : ""}`}
        aria-current={active(item.href) ? "page" : undefined}
        onClick={(event) => onNavigate(event, item.href)}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="academic-mobile-accordion">
      <button
        type="button"
        className="academic-mobile-accordion-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>
      <div className={`academic-mobile-accordion-panel ${open ? "is-open" : ""}`}>
        <div className="flex flex-col gap-2 pl-4 pt-2">
          {item.children.map((child) => (
            <a
              key={child.href}
              href={child.href}
              className={`academic-mobile-link ${active(child.href) ? "is-active" : ""}`}
              aria-current={active(child.href) ? "page" : undefined}
              onClick={(event) => onNavigate(event, child.href)}
            >
              {child.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header({
  logo,
  logoHref = "/",
  logoAlt,
  brandName,
  brandSubtext,
  eyebrow,
  affiliation,
  location,
  statusLabel,
  navItems = [],
  ctaButton = { label: "Get in Touch", href: "/support-center" },
  secondaryCta,
  utilityLinks,
  sticky = true,
  navStyle = "flat",
  showReadingProgress = true,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePathname, setActivePathname] = useState("/");
  const [activeHash, setActiveHash] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const safeNavItems = useMemo(
    () => (Array.isArray(navItems) ? navItems : []),
    [navItems]
  );
  const cta = normalizeAction(ctaButton) ?? {
    label: "Get in Touch",
    href: "/support-center",
  };
  const secondary = normalizeAction(secondaryCta);
  const normalizedUtilityLinks = normalizeUtilityLinks(utilityLinks);
  const resolvedBrandName = brandName?.trim() || logoAlt || "Aarti Sri Ravikumar";
  const resolvedBrandSubtext = brandSubtext?.trim();
  const resolvedEyebrow = eyebrow?.trim() || "Evidence-led portfolio";
  const resolvedStatusLabel = statusLabel?.trim();
  const homeAnchorIds = useMemo(
    () =>
      safeNavItems
        .map((item) => anchorIdFromHref(item.href))
        .filter((item): item is string => Boolean(item)),
    [safeNavItems]
  );

  const resolveActiveState = (href: string): boolean => {
    if (!href) return false;

    const anchorId = anchorIdFromHref(href);
    if (anchorId) {
      return activePathname === "/" && activeHash === anchorId;
    }

    const [pathPart] = href.split("#");
    const normalized = pathPart || "/";

    if (normalized === "/") {
      return activePathname === "/" && !activeHash;
    }

    return activePathname === normalized;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateLocationState = () => {
      setActivePathname(window.location.pathname || "/");
      setActiveHash(window.location.hash.replace(/^#/, "").trim());
    };

    updateLocationState();
    window.addEventListener("popstate", updateLocationState);
    window.addEventListener("hashchange", updateLocationState);

    return () => {
      window.removeEventListener("popstate", updateLocationState);
      window.removeEventListener("hashchange", updateLocationState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHashScroll = () => {
      if (window.location.pathname !== "/") {
        return;
      }

      const anchorId = window.location.hash.replace(/^#/, "").trim();

      if (anchorId) {
        scrollToAnchor(anchorId, "auto");
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      const scrollMax =
        document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(window.scrollY > 12);
      setReadingProgress(scrollMax > 0 ? Math.min(1, window.scrollY / scrollMax) : 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.pathname !== "/") {
      return;
    }

    const elements = homeAnchorIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHash(visible.target.id);
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.12, 0.24, 0.4, 0.6],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [activePathname, homeAnchorIds]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuOpen) {
        return;
      }

      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
    closeMenu = false
  ) => {
    if (closeMenu) {
      setMenuOpen(false);
    }

    if (typeof window === "undefined" || !href.includes("#")) {
      return;
    }

    const anchorId = anchorIdFromHref(href);
    if (!anchorId || !isHomeAnchor(href)) {
      return;
    }

    if (window.location.pathname !== "/") {
      event.preventDefault();
      window.location.assign(`/#${anchorId}`);
      return;
    }

    event.preventDefault();
    setActiveHash(anchorId);
    scrollToAnchor(anchorId, "smooth");
  };

  return (
    <header
      role="banner"
      ref={headerRef}
      className={`academic-header ${sticky ? "is-sticky" : ""} ${isScrolled ? "is-scrolled" : ""}`}
    >
      <a href="#main-content" className="academic-skip-link">
        Skip to main content
      </a>

      <div className="academic-header-rail">
        <div className="academic-header-inner academic-header-rail-inner">
          <div className="academic-header-context" aria-label="Academic context">
            <span className="academic-header-eyebrow">
              <BookOpen size={14} aria-hidden="true" />
              {resolvedEyebrow}
            </span>
            {affiliation && (
              <span>
                <GraduationCap size={14} aria-hidden="true" />
                {affiliation}
              </span>
            )}
            {location && (
              <span>
                <MapPin size={14} aria-hidden="true" />
                {location}
              </span>
            )}
          </div>

          <div className="academic-header-utilities" aria-label="Research utility links">
            {resolvedStatusLabel && (
              <span className="academic-header-status">{resolvedStatusLabel}</span>
            )}
            {normalizedUtilityLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={isExternalHref(link.href) ? "_blank" : undefined}
                rel={isExternalHref(link.href) ? "noopener noreferrer" : undefined}
              >
                <UtilityLinkIcon {...link} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="academic-header-main">
        <div className="academic-header-inner academic-header-main-inner">
          <a href={logoHref} className="academic-header-brand" aria-label={`${logoAlt} homepage`}>
            {logo ? (
              <img
                src={logo}
                alt={logoAlt}
                width={44}
                height={44}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="academic-header-logo"
              />
            ) : (
              <span className="academic-header-logo-fallback">
                {logoAlt.slice(0, 2).toUpperCase()}
              </span>
            )}
            {brandName && (
              <span className="academic-header-brand-copy">
                <span className="academic-header-brand-name">{brandName}</span>
                {resolvedBrandSubtext && (
                  <span className="academic-header-brand-subtext">{resolvedBrandSubtext}</span>
                )}
              </span>
            )}
          </a>

          <nav className="academic-header-nav" aria-label="Primary navigation">
            {safeNavItems.map((item) => {
              const hasChildren =
                item.children &&
                item.children.length > 0 &&
                navStyle !== "flat";
              const active = resolveActiveState(item.href);

              if (!hasChildren) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`academic-header-nav-link ${active ? "is-active" : ""}`}
                    onClick={(event) => handleNavClick(event, item.href)}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <div key={item.label} className="academic-header-menu-group">
                  <button type="button" className="academic-header-nav-link">
                    {item.label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>
                  {navStyle === "mega" ? (
                    <DesktopMegaMenu items={item.children!} />
                  ) : (
                    <DesktopDropdown children={item.children!} />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="academic-header-actions">
            {secondary && (
              <a
                href={secondary.href}
                target={isExternalHref(secondary.href) ? "_blank" : undefined}
                rel={isExternalHref(secondary.href) ? "noopener noreferrer" : undefined}
                className="academic-header-secondary"
              >
                {secondary.label}
              </a>
            )}
            <a href={cta.href} className="academic-header-primary">
              {cta.label}
            </a>
          </div>

          <button
            type="button"
            className="academic-header-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-primary-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        id="mobile-primary-nav"
        hidden={!menuOpen}
        aria-hidden={!menuOpen}
        className="academic-mobile-drawer"
      >
        <div className="academic-mobile-card">
          <p className="academic-header-eyebrow">
            <BookOpen size={14} aria-hidden="true" />
            {resolvedEyebrow}
          </p>
          <p className="academic-mobile-title">{resolvedBrandName}</p>
          {affiliation && <p className="academic-mobile-meta">{affiliation}</p>}
          {location && <p className="academic-mobile-meta">{location}</p>}
        </div>

        <nav className="academic-mobile-nav" aria-label="Mobile primary navigation">
          {safeNavItems.map((item) =>
            navStyle !== "flat" &&
            item.children &&
            item.children.length > 0 ? (
              <MobileAccordion
                key={item.label}
                item={item}
                active={resolveActiveState}
                onNavigate={(event, href) => handleNavClick(event, href, true)}
              />
            ) : (
              <a
                key={item.href}
                href={item.href}
                aria-current={resolveActiveState(item.href) ? "page" : undefined}
                className={`academic-mobile-link ${resolveActiveState(item.href) ? "is-active" : ""}`}
                onClick={(event) => handleNavClick(event, item.href, true)}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="academic-mobile-actions">
          {secondary && (
            <a
              href={secondary.href}
              target={isExternalHref(secondary.href) ? "_blank" : undefined}
              rel={isExternalHref(secondary.href) ? "noopener noreferrer" : undefined}
              className="academic-header-secondary"
              onClick={() => setMenuOpen(false)}
            >
              {secondary.label}
            </a>
          )}
          <a
            href={cta.href}
            className="academic-header-primary"
            onClick={() => setMenuOpen(false)}
          >
            {cta.label}
          </a>
        </div>

        {normalizedUtilityLinks.length > 0 && (
          <div className="academic-mobile-utilities">
            {normalizedUtilityLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={isExternalHref(link.href) ? "_blank" : undefined}
                rel={isExternalHref(link.href) ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <UtilityLinkIcon {...link} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {showReadingProgress && (
        <div className="academic-header-progress" aria-hidden="true">
          <svg viewBox="0 0 100 1" preserveAspectRatio="none" className="academic-header-progress-bar">
            <defs>
              <linearGradient id="academicHeaderProgressGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--research-green)" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width={Math.max(0, Math.min(100, readingProgress * 100))}
              height="1"
              fill="url(#academicHeaderProgressGradient)"
            />
          </svg>
        </div>
      )}
    </header>
  );
}

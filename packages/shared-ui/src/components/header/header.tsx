"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ChevronDown } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type CtaButton = {
  label: string;
  href: string;
};

export type NavStyle = "flat" | "dropdown" | "mega";

export type HeaderProps = {
  logo: string;
  logoAlt: string;
  navItems: NavItem[];
  ctaButton: CtaButton;
  sticky: boolean;
  navStyle?: NavStyle;
};

type HeaderCtaVariant = "control" | "engage";

const CTA_VARIANT_STORAGE_KEY = "header-cta-variant";

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

function DesktopDropdown({ children }: { children: NavItem[] }) {
  return (
    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-50">
      <div className="rounded-lg py-2 shadow-lg bg-(--surface) border border-border">
        {children.map((child) => (
          <a
            key={child.href}
            href={child.href}
            className="block px-4 py-2 text-sm font-medium transition-colors text-(--text-secondary) hover:text-primary"
          >
            {child.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function DesktopMegaMenu({ items }: { items: NavItem[] }) {
  const groupedItems = {
    work: items.filter((item) => /project|blog|work|portfolio/i.test(item.label)),
    profile: items.filter((item) => /about|journey|proof|bio/i.test(item.label)),
    connect: items.filter((item) => /contact|support|get in touch/i.test(item.label)),
  };

  const remainder = items.filter(
    (item) =>
      !groupedItems.work.includes(item) &&
      !groupedItems.profile.includes(item) &&
      !groupedItems.connect.includes(item),
  );

  const columns = [
    { heading: "Work", links: groupedItems.work },
    { heading: "Profile", links: groupedItems.profile },
    { heading: "Connect", links: groupedItems.connect },
    { heading: "More", links: remainder },
  ].filter((column) => column.links.length > 0);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-[90vw] max-w-190">
      <div className="rounded-xl p-6 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 bg-(--surface) border border-border">
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-2">
              {column.heading}
            </p>
            <div className="space-y-1">
              {column.links.map((child) => (
                <a
                  key={child.href}
                  href={child.href}
                  className="block text-sm font-medium py-1 transition-colors text-(--text-secondary) hover:text-primary"
                >
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
}: {
  item: NavItem;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <a
        href={item.href}
        className="text-sm font-medium py-1 text-(--text-secondary)"
        onClick={(event) => onNavigate(event, item.href)}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center justify-between text-sm font-medium py-1 text-(--text-secondary)"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-80" : "max-h-0"}`}>
        <div>
          <div className="flex flex-col gap-2 pl-4 pt-2">
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="text-sm py-1 text-(--text-secondary)"
                onClick={(event) => onNavigate(event, child.href)}
              >
                {child.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({
  logo,
  logoAlt,
  navItems = [],
  ctaButton = { label: "Get in Touch", href: "/support-center" },
  sticky = true,
  navStyle = "flat",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [activePathname, setActivePathname] = useState("/");
  const [ctaVariant, setCtaVariant] = useState<HeaderCtaVariant>("control");
  const lastScrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const safeNavItems = Array.isArray(navItems) ? navItems : [];
  const ctaHref = ctaButton?.href || "/support-center";
  const ctaLabel = ctaButton?.label || "Get in Touch";

  const resolvedCtaLabel =
    ctaVariant === "engage" ? `Start: ${ctaLabel}` : ctaLabel;

  const resolvedCtaClass =
    ctaVariant === "engage"
      ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] ring-2 ring-[color:var(--primary)]/25"
      : "bg-[var(--primary)] text-[color:var(--primary-foreground)]";

  const resolveActiveState = (href: string): boolean => {
    if (!href) return false;

    const [pathPart] = href.split("#");
    const normalized = pathPart || "/";

    if (normalized === "/") {
      return activePathname === "/";
    }

    return activePathname === normalized;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHashScroll = () => {
      if (window.location.pathname !== "/") {
        return;
      }

      const anchorId = window.location.hash.replace(/^#/, "").trim();

      if (!anchorId) {
        return;
      }

      scrollToAnchor(anchorId, "auto");
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
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updatePath = () => {
      setActivePathname(window.location.pathname || "/");
    };

    updatePath();
    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleAdaptiveScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;

      if (menuOpen) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = y;
        return;
      }

      if (y < 16 || delta < -10) {
        setIsHeaderHidden(false);
      } else if (delta > 12 && y > 120) {
        setIsHeaderHidden(true);
      }

      lastScrollYRef.current = y;
    };

    handleAdaptiveScroll();
    window.addEventListener("scroll", handleAdaptiveScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleAdaptiveScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const queryVariant = params.get("ctaVariant");

    if (queryVariant === "control" || queryVariant === "engage") {
      setCtaVariant(queryVariant);
      window.localStorage.setItem(CTA_VARIANT_STORAGE_KEY, queryVariant);
      return;
    }

    const savedVariant = window.localStorage.getItem(CTA_VARIANT_STORAGE_KEY);
    if (savedVariant === "control" || savedVariant === "engage") {
      setCtaVariant(savedVariant);
      return;
    }

    const assignedVariant: HeaderCtaVariant =
      Math.random() > 0.5 ? "engage" : "control";

    setCtaVariant(assignedVariant);
    window.localStorage.setItem(CTA_VARIANT_STORAGE_KEY, assignedVariant);
  }, []);

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

    const [pathPart, hashPart] = href.split("#");
    const anchorId = hashPart?.trim();

    if (!anchorId) {
      return;
    }

    const isHomeAnchor = pathPart === "" || pathPart === "/";
    const isOnHomePage = window.location.pathname === "/";

    if (!isHomeAnchor) {
      return;
    }

    if (!isOnHomePage) {
      event.preventDefault();
      window.location.assign(`/#${anchorId}`);
      return;
    }

    event.preventDefault();
    scrollToAnchor(anchorId, "smooth");
  };

  return (
    <header
      ref={headerRef}
      className={`${sticky ? "sticky top-0" : "relative"} z-50 border-b border-(--border)/80 backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? "bg-(--surface)/90 shadow-[0_12px_35px_rgba(12,22,48,0.08)]"
          : "bg-(--surface)/75"
      } ${sticky && isHeaderHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-60 focus:px-3 focus:py-2 focus:rounded-md focus:bg-(--surface) focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={logoAlt}
                width={96}
                height={32}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {logoAlt}
              </span>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
            {safeNavItems.map((item) => {
              const hasChildren =
                item.children &&
                item.children.length > 0 &&
                navStyle !== "flat";

              if (!hasChildren) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={resolveActiveState(item.href) ? "page" : undefined}
                    className={`text-sm font-medium transition-colors ${
                      resolveActiveState(item.href)
                        ? "text-primary"
                        : "text-(--text-secondary) hover:text-primary"
                    }`}
                    onClick={(event) => handleNavClick(event, item.href)}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-medium transition-colors text-(--text-secondary) hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown size={14} />
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

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <a
              href={ctaHref}
              data-cta-variant={ctaVariant}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(37,86,160,0.28)] ${resolvedCtaClass}`}
            >
              {resolvedCtaLabel}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`block w-5 h-0.5 transition-transform duration-200 bg-(--text-primary) ${
                menuOpen ? "rotate-45 translate-x-0.5 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 transition-opacity duration-200 bg-(--text-primary) ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-5 h-0.5 transition-transform duration-200 bg-(--text-primary) ${
                menuOpen ? "-rotate-45 translate-x-0.5 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-primary-nav"
        hidden={!menuOpen}
        aria-hidden={!menuOpen}
        className="lg:hidden border-t bg-(--surface) border-border"
      >
        <nav className="flex flex-col px-4 py-4 gap-3 max-h-[calc(100vh-4rem)] overflow-y-auto" aria-label="Mobile primary navigation">
          {safeNavItems.map((item) =>
            navStyle !== "flat" &&
            item.children &&
            item.children.length > 0 ? (
              <MobileAccordion
                key={item.label}
                item={item}
                onNavigate={(event, href) => handleNavClick(event, href, true)}
              />
            ) : (
              <a
                key={item.href}
                href={item.href}
                aria-current={resolveActiveState(item.href) ? "page" : undefined}
                className={`text-sm font-medium py-1 ${
                  resolveActiveState(item.href)
                    ? "text-primary"
                    : "text-(--text-secondary)"
                }`}
                onClick={(event) => handleNavClick(event, item.href, true)}
              >
                {item.label}
              </a>
            ),
          )}
          <a
            href={ctaHref}
            data-cta-variant={ctaVariant}
            className={`mt-2 px-4 py-2 text-sm font-semibold rounded-full text-center ${resolvedCtaClass}`}
            onClick={() => setMenuOpen(false)}
          >
            {resolvedCtaLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}

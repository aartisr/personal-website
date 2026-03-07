"use client";

import { useEffect, useState, type MouseEvent } from "react";
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
    <div
      className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
      style={{ minWidth: "200px" }}
    >
      <div
        className="rounded-lg py-2 shadow-lg"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {children.map((child) => (
          <a
            key={child.href}
            href={child.href}
            className="block px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            {child.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function DesktopMegaMenu({ items }: { items: NavItem[] }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
      style={{ width: "min(90vw, 600px)" }}
    >
      <div
        className="rounded-lg p-6 shadow-lg grid grid-cols-2 gap-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {items.map((child) => (
          <a
            key={child.href}
            href={child.href}
            className="block text-sm font-medium py-1 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            {child.label}
          </a>
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
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <a
        href={item.href}
        className="text-sm font-medium py-1"
        style={{ color: "var(--text-secondary)" }}
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
        className="w-full flex items-center justify-between text-sm font-medium py-1"
        style={{ color: "var(--text-secondary)" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.25s ease",
        }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pl-4 pt-2">
            {item.children.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="text-sm py-1"
                style={{ color: "var(--text-secondary)" }}
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
  navItems,
  ctaButton,
  sticky,
  navStyle = "flat",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
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
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        zIndex: 50,
      }}
      className={sticky ? "sticky top-0" : "relative"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={logoAlt}
                className="h-8 w-auto"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <span
                className="text-xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {logoAlt}
              </span>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const hasChildren =
                item.children &&
                item.children.length > 0 &&
                navStyle !== "flat";

              if (!hasChildren) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onClick={(event) => handleNavClick(event, item.href)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-secondary)")
                    }
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-secondary)")
                    }
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
          <div className="hidden md:flex items-center">
            <a
              href={ctaButton.href}
              className="px-4 py-2 text-sm font-semibold rounded-full transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {ctaButton.label}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className="block w-5 h-0.5 transition-transform duration-200"
              style={{
                backgroundColor: "var(--text-primary)",
                transform: menuOpen
                  ? "rotate(45deg) translate(2px, 6px)"
                  : "none",
              }}
            />
            <span
              className="block w-5 h-0.5 transition-opacity duration-200"
              style={{
                backgroundColor: "var(--text-primary)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-transform duration-200"
              style={{
                backgroundColor: "var(--text-primary)",
                transform: menuOpen
                  ? "rotate(-45deg) translate(2px, -6px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <nav className="flex flex-col px-4 py-4 gap-3">
            {navItems.map((item) =>
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
                  className="text-sm font-medium py-1"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={(event) => handleNavClick(event, item.href, true)}
                >
                  {item.label}
                </a>
              ),
            )}
            <a
              href={ctaButton.href}
              className="mt-2 px-4 py-2 text-sm font-semibold rounded-full text-center"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {ctaButton.label}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

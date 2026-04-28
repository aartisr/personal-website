"use client";

import { Icon } from "../icon-map";

export type Service = {
  icon: string;
  title: string;
  description: string;
  href: string;
};

export type ServicesGridProps = {
  heading: string;
  description: string;
  services: Service[];
  anchorId?: string;
};

export function ServicesGrid({
  heading,
  description,
  services,
  anchorId,
}: ServicesGridProps) {
  return (
    <section
      id={anchorId}
      className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        {(heading || description) && (
          <div className="text-center mb-14">
            {heading && (
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                className="mt-4 text-lg max-w-2xl mx-auto"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Tag = service.href ? "a" : "div";
            const isExternal =
              service.href?.startsWith("http://") ||
              service.href?.startsWith("https://");
            const linkProps = service.href
              ? {
                  href: service.href,
                  target: isExternal ? "_blank" : undefined,
                  rel: isExternal ? "noopener noreferrer" : undefined,
                }
              : {};

            return (
              <Tag
                key={index}
                {...linkProps}
                className="group flex flex-col p-7 rounded-lg transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--primary)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px color-mix(in oklch, var(--primary) 15%, transparent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {service.icon && (
                  <div
                    className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        "color-mix(in oklch, var(--primary) 12%, transparent)",
                      color: "var(--primary)",
                    }}
                  >
                    <Icon name={service.icon} size={24} />
                  </div>
                )}
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {service.description}
                </p>
                {service.href && (
                  <span
                    className="mt-5 text-sm font-semibold flex items-center gap-1 transition-gap"
                    style={{ color: "var(--primary)" }}
                  >
                    Learn more
                    <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform inline-block">
                      →
                    </span>
                  </span>
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

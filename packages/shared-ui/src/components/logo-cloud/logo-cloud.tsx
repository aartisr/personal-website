import React from "react";

export type LogoItem = {
  src: string;
  alt: string;
  href: string;
};

export type LogoCloudProps = {
  anchorId?: string;
  heading: string;
  logos: LogoItem[];
};

export function LogoCloud({ anchorId, heading, logos }: LogoCloudProps) {
  return (
    <section id={anchorId || undefined} className="relative w-full py-16 px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_7%,transparent),transparent)]"
      />
      <div className="max-w-5xl mx-auto">
        {heading && (
          <p
            className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] mb-8 text-muted-foreground"
          >
            {heading}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {logos.map((logo, index) => {
            const image = (
              <img
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-8 w-auto object-contain transition-all duration-300 grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100"
              />
            );

            return logo.href ? (
              <a
                key={index}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={logo.alt}
                className="group flex items-center justify-center rounded-lg border border-(--border)/85 bg-(--card)/78 px-4 py-5 shadow-[0_8px_24px_rgba(12,22,48,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(12,22,48,0.1)]"
              >
                {image}
              </a>
            ) : (
              <span
                key={index}
                className="group flex items-center justify-center rounded-lg border border-(--border)/85 bg-(--card)/78 px-4 py-5 shadow-[0_8px_24px_rgba(12,22,48,0.05)]"
              >
                {image}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

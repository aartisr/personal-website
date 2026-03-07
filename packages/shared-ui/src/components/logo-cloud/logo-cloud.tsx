import React from "react";

export type LogoItem = {
  src: string;
  alt: string;
  href: string;
};

export type LogoCloudProps = {
  heading: string;
  logos: LogoItem[];
};

export function LogoCloud({ heading, logos }: LogoCloudProps) {
  return (
    <section className="w-full py-14 px-4">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: "var(--muted-foreground)" }}
          >
            {heading}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => {
            const image = (
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-auto object-contain transition-all duration-300"
                style={{
                  filter: "grayscale(100%)",
                  opacity: 0.5,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter =
                    "grayscale(0%)";
                  (e.currentTarget as HTMLImageElement).style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter =
                    "grayscale(100%)";
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.5";
                }}
              />
            );

            return logo.href ? (
              <a
                key={index}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={logo.alt}
                className="flex items-center"
              >
                {image}
              </a>
            ) : (
              <span key={index} className="flex items-center">
                {image}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

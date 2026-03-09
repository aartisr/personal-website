import React from "react";
import type { RoyalStyle } from "../royal/types";
import { RoyalCorners } from "../royal/royal-corners";
import { YantraBackground } from "../royal/yantra-background";
import "./cta-section.css";

export type CtaLink = {
  label: string;
  href: string;
};

export type CtaSectionProps = {
  variant: "banner" | "split";
  heading: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  royalStyle?: RoyalStyle;
};

function PrimaryButton({ label, href }: CtaLink) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] cta-section-split-primary"
    >
      {label}
    </a>
  );
}

function SecondaryButton({ label, href }: CtaLink) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.98] cta-section-split-secondary"
    >
      {label}
    </a>
  );
}

export function CtaSection({
  variant,
  heading,
  description,
  primaryCta,
  secondaryCta,
  royalStyle = "none",
}: CtaSectionProps) {
  if (variant === "banner") {
    return (
      <section className="w-full py-20 px-4">
        <div className="relative max-w-5xl mx-auto rounded-3xl px-8 py-16 text-center overflow-hidden cta-section-banner">
          {royalStyle !== "none" && <YantraBackground royalStyle={royalStyle} />}
          {royalStyle !== "none" && <RoyalCorners royalStyle={royalStyle} />}
          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight mb-4 cta-section-banner-heading">
            {heading}
          </h2>
          {description && (
            <p className="relative text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed cta-section-banner-description">
              {description}
            </p>
          )}
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center cta-section-banner-buttons">
            {primaryCta?.label && (
              <a
                href={primaryCta.href}
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] cta-section-banner-primary"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta?.label && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all hover:bg-white/10 active:scale-[0.98] cta-section-banner-secondary"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Split variant
  return (
    <section className="w-full py-16 px-4 cta-section-split">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text side */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 cta-section-split-heading">
            {heading}
          </h2>
          {description && (
            <p className="text-base leading-relaxed cta-section-split-description">
              {description}
            </p>
          )}
        </div>

        {/* CTA side */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {primaryCta?.label && (
            <PrimaryButton label={primaryCta.label} href={primaryCta.href} />
          )}
          {secondaryCta?.label && (
            <SecondaryButton
              label={secondaryCta.label}
              href={secondaryCta.href}
            />
          )}
        </div>
      </div>
    </section>
  );
}

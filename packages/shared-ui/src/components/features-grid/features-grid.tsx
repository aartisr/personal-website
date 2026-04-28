"use client";

import { Icon } from "../icon-map";
import "./features-grid.css";
import { type AnimationType, useScrollReveal } from "../scroll-reveal";
import type { RoyalStyle } from "../royal/types";
import { YantraBackground } from "../royal/yantra-background";

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  icon?: string;
  label?: string;
  title: string;
  description?: string;
};

export type FeaturesGridProps = {
  anchorId?: string;
  heading: string;
  description: string;
  features: Feature[];
  processEyebrow?: string;
  processSteps?: ProcessStep[];
  columns: 2 | 3 | 4;
  animation?: AnimationType;
  topSpacing?: "compact" | "normal" | "relaxed";
  bottomSpacing?: "compact" | "normal" | "relaxed";
  royalStyle?: RoyalStyle;
};

const columnClasses: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const topSpacingClasses = {
  compact: "pt-5 sm:pt-6 lg:pt-6",
  normal: "pt-16 sm:pt-20 lg:pt-20",
  relaxed: "pt-20 sm:pt-24 lg:pt-28",
};

const bottomSpacingClasses = {
  compact: "pb-6 sm:pb-7 lg:pb-8",
  normal: "pb-16 sm:pb-20 lg:pb-20",
  relaxed: "pb-20 sm:pb-24 lg:pb-28",
};

export function FeaturesGrid({
  anchorId,
  heading,
  description,
  features,
  processEyebrow,
  processSteps,
  columns,
  animation = "slide-up",
  topSpacing = "normal",
  bottomSpacing = "normal",
  royalStyle = "none",
}: FeaturesGridProps) {
  const gridClass = columnClasses[columns] ?? columnClasses[3];
  const { ref, isVisible } = useScrollReveal(animation);
  const normalizedSteps = Array.isArray(processSteps)
    ? processSteps.filter((step) => step?.title)
    : [];
  const headerSpacingClass = normalizedSteps.length > 0 ? "mb-8" : "mb-14";
  const descriptionSpacingClass = normalizedSteps.length > 0 ? "mt-3" : "mt-4";

  return (
    <section
      id={anchorId || undefined}
      ref={ref}
      className={`relative scroll-mt-24 px-4 sm:px-6 lg:px-8 features-grid-section ${topSpacingClasses[topSpacing] ?? topSpacingClasses.normal} ${bottomSpacingClasses[bottomSpacing] ?? bottomSpacingClasses.normal}`}
    >
      {royalStyle !== "none" && <YantraBackground royalStyle={royalStyle} />}
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        {(heading || description) && (
          <div className={`text-center ${headerSpacingClass}`}>
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold features-grid-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className={`${descriptionSpacingClass} text-lg max-w-2xl mx-auto features-grid-description`}>
                {description}
              </p>
            )}
          </div>
        )}

        {normalizedSteps.length > 0 && (
          <div
            className="features-grid-process"
            aria-label={processEyebrow || "Methodology process diagram"}
          >
            {processEyebrow && (
              <p className="features-grid-process-eyebrow">{processEyebrow}</p>
            )}
            <ol className="features-grid-process-list">
              {normalizedSteps.map((step, index) => (
                <li key={`${step.title}-${index}`} className="features-grid-process-step">
                  <div className="features-grid-process-icon" aria-hidden="true">
                    <Icon name={step.icon || String(index + 1)} size={20} />
                  </div>
                  {step.label && (
                    <p className="features-grid-process-label">{step.label}</p>
                  )}
                  <h3 className="features-grid-process-title">{step.title}</h3>
                  {step.description && (
                    <p className="features-grid-process-description">
                      {step.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Feature cards */}
        <div className={`grid ${gridClass} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 rounded-lg features-grid-card${royalStyle === "ornate" ? " ornate" : ""} ${isVisible ? "features-grid-reveal" : ""}`}
              data-transition-delay={isVisible ? `${index * 100}` : "0"}
            >
              {feature.icon && (
                <div className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-md features-grid-icon">
                  <Icon name={feature.icon} size={24} />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2 features-grid-title">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed features-grid-description-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

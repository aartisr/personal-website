"use client";

import { Icon } from "../icon-map";
import "./features-grid.css";
import { type AnimationType, useScrollReveal, getRevealStyles } from "../scroll-reveal";
import type { RoyalStyle } from "../royal/types";
import { YantraBackground } from "../royal/yantra-background";

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type FeaturesGridProps = {
  heading: string;
  description: string;
  features: Feature[];
  columns: 2 | 3 | 4;
  animation?: AnimationType;
  royalStyle?: RoyalStyle;
};

const columnClasses: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function FeaturesGrid({
  heading,
  description,
  features,
  columns,
  animation = "slide-up",
  royalStyle = "none",
}: FeaturesGridProps) {
  const gridClass = columnClasses[columns] ?? columnClasses[3];
  const { ref, isVisible } = useScrollReveal(animation);

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 sm:px-6 lg:px-8 features-grid-section"
    >
      {royalStyle !== "none" && <YantraBackground royalStyle={royalStyle} />}
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        {(heading || description) && (
          <div className="text-center mb-14">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold features-grid-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg max-w-2xl mx-auto features-grid-description">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Feature cards */}
        <div className={`grid ${gridClass} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 rounded-2xl features-grid-card${royalStyle === "ornate" ? " ornate" : ""} ${isVisible ? "features-grid-reveal" : ""}`}
              data-transition-delay={isVisible ? `${index * 100}` : "0"}
            >
              {feature.icon && (
                <div className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl features-grid-icon">
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

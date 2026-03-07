"use client";

import { useState } from "react";
import { type AnimationType, useScrollReveal, getRevealStyles } from "../scroll-reveal";
import type { RoyalStyle } from "../royal/types";
import { RoyalCorners } from "../royal/royal-corners";
import { RoyalDivider } from "../royal/royal-divider";

export type TimelineVariant = "alternating" | "left" | "centered";

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export type TimelineSectionProps = {
  heading: string;
  description: string;
  items: TimelineItem[];
  variant: TimelineVariant;
  animation: AnimationType;
  royalStyle?: RoyalStyle;
};

function TimelineCard({
  item,
  index,
  side,
  animation,
  royalStyle = "none",
}: {
  item: TimelineItem;
  index: number;
  side: "left" | "right" | "center";
  animation: AnimationType;
  royalStyle?: RoyalStyle;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const revealAnimation: AnimationType =
    animation === "none"
      ? "none"
      : side === "left"
        ? "slide-right"
        : side === "right"
          ? "slide-left"
          : animation;

  const { ref, style } = useScrollReveal(revealAnimation);

  return (
    <div
      ref={ref}
      style={style}
      className={`relative flex ${
        side === "right"
          ? "md:justify-end md:text-left"
          : side === "left"
            ? "md:justify-start md:text-right"
            : "justify-center"
      }`}
    >
      <div
        className="relative w-full md:w-5/12 rounded-xl overflow-hidden cursor-pointer"
        style={{
          backgroundColor: "var(--card)",
          border: royalStyle === "ornate"
            ? "1px solid var(--royal-gold)"
            : "1px solid var(--border)",
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {royalStyle === "ornate" && <RoyalCorners royalStyle="subtle" />}
        {/* Year badge */}
        <div
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--primary) 12%, transparent)",
            color: "var(--primary)",
          }}
        >
          {item.year}
        </div>

        {/* Card body */}
        <div className="px-5 py-4">
          <h3
            className="text-lg font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {item.title}
          </h3>

          {/* Expandable description */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: expanded ? "1fr" : "0fr",
              transition: "grid-template-rows 0.25s ease",
            }}
          >
            <div className="overflow-hidden">
              <p
                className="text-sm leading-relaxed pt-1 pb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.description}
              </p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineSection({
  heading,
  description,
  items,
  variant = "alternating",
  animation = "slide-up",
  royalStyle = "none",
}: TimelineSectionProps) {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-5xl mx-auto">
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

        {royalStyle !== "none" && (heading || description) && (
          <RoyalDivider royalStyle={royalStyle} />
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px -translate-x-1/2"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex flex-col gap-10">
            {items.map((item, index) => {
              const side: "left" | "right" | "center" =
                variant === "centered"
                  ? "center"
                  : variant === "left"
                    ? "right"
                    : index % 2 === 0
                      ? "right"
                      : "left";

              return (
                <div key={index} className="relative pl-10 md:pl-0">
                  {/* Dot on the line */}
                  <div
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 top-4 z-10"
                    style={{
                      backgroundColor: "var(--primary)",
                      boxShadow:
                        "0 0 0 4px color-mix(in oklch, var(--primary) 20%, transparent)",
                    }}
                  />

                  <TimelineCard
                    item={item}
                    index={index}
                    side={side}
                    animation={animation}
                    royalStyle={royalStyle}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

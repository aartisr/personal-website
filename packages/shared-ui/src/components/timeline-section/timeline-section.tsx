"use client";

import { useState } from "react";
import { type AnimationType } from "../scroll-reveal";
import type { RoyalStyle } from "../royal/types";
import { RoyalCorners } from "../royal/royal-corners";
import { RoyalDivider } from "../royal/royal-divider";
import { normalizeTimelineItems } from "./normalize-timeline-items";
import "./timeline-section.css";

export type TimelineVariant = "alternating" | "left" | "centered";

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export type TimelineSectionProps = {
  anchorId?: string;
  heading: string;
  description: string;
  items?: TimelineItem[];
  variant: TimelineVariant;
  animation: AnimationType;
  royalStyle?: RoyalStyle;
};

function TimelineCard({
  item,
  index,
  side,
  royalStyle = "none",
}: {
  item: TimelineItem;
  index: number;
  side: "left" | "right" | "center";
  royalStyle?: RoyalStyle;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div
      className={`relative flex timeline-card-reveal ${
        side === "right"
          ? "md:justify-end md:text-left"
          : side === "left"
            ? "md:justify-start md:text-right"
            : "justify-center"
      }`}
    >
      <div
        className={`relative w-full md:w-5/12 timeline-card${royalStyle === "ornate" ? " ornate" : ""}`}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {royalStyle === "ornate" && <RoyalCorners royalStyle="subtle" />}
        {/* Year badge */}
        <div
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest timeline-card-year"
        >
          {item.year}
        </div>

        {/* Card body */}
        <div className="px-5 py-4">
          <h3 className="text-lg font-semibold mb-1 timeline-card-title">
            {item.title}
          </h3>

          {/* Expandable description */}
          <div className={`timeline-card-expand ${expanded ? "expanded" : "collapsed"}`}>
            <div className="overflow-hidden">
              <p className="text-sm leading-relaxed timeline-card-description">
                {item.description}
              </p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  width={1200}
                  height={480}
                  loading="lazy"
                  decoding="async"
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
  anchorId,
  heading,
  description,
  items,
  variant = "alternating",
  royalStyle = "none",
}: TimelineSectionProps) {
  const safeItems = normalizeTimelineItems(items);

  return (
    <section
      id={anchorId || undefined}
      className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 timeline-section"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        {(heading || description) && (
          <div className="text-center mb-14">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold timeline-section-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg max-w-2xl mx-auto timeline-section-description">
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
            className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px -translate-x-1/2 timeline-section-vertical-line"
          />

          <div className="flex flex-col gap-10">
            {safeItems.map((item, index) => {
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
                  {/* Dot on the line with tooltip */}
                  <div
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 top-4 z-10 timeline-section-dot group"
                  >
                    <span className="timeline-dot-tooltip">
                      {item.year} — {item.title}
                    </span>
                  </div>
                  {/* Connector line between dots */}
                  {index < safeItems.length - 1 && (
                    <div
                      className="timeline-section-connector"
                      data-connector
                    />
                  )}
                  <TimelineCard
                    item={item}
                    index={index}
                    side={side}
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

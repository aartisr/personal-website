"use client";

import type { RoyalStyle } from "../royal/types";
import { YantraBackground } from "../royal/yantra-background";
import { RoyalCorners } from "../royal/royal-corners";
import "./testimonials-section.css";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export type TestimonialsSectionProps = {
  heading: string;
  testimonials: Testimonial[];
  royalStyle?: RoyalStyle;
  anchorId?: string;
  showRating?: boolean;
};

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 testimonials-section-star"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-11 h-11 rounded-full object-cover testimonials-section-avatar-img"
      />
    );
  }

  // Fallback initials avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 testimonials-section-avatar-fallback"
    >
      {initials}
    </div>
  );
}

export function TestimonialsSection({
  heading,
  testimonials,
  royalStyle = "none",
  anchorId,
  showRating = true,
}: TestimonialsSectionProps) {
  return (
    <section
      id={anchorId}
      className="relative py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24 testimonials-section"
    >
      {royalStyle !== "none" && <YantraBackground royalStyle={royalStyle} />}
      <div className="max-w-7xl mx-auto">
        {heading && (
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold testimonials-section-heading">
              {heading}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-7 rounded-lg testimonials-section-card${royalStyle === "ornate" ? " ornate" : ""}`}
            >
              {royalStyle === "ornate" && <RoyalCorners royalStyle="subtle" />}
              {showRating && <StarRating />}

              <blockquote className="flex-1 text-base leading-relaxed mb-6 testimonials-section-blockquote">
                <span className={royalStyle !== "none" ? "testimonials-section-blockquote-gold" : undefined}>
                  &ldquo;
                </span>
                {testimonial.quote}
                <span className={royalStyle !== "none" ? "testimonials-section-blockquote-gold" : undefined}>
                  &rdquo;
                </span>
              </blockquote>

              <div className="flex items-center gap-3">
                <Avatar src={testimonial.avatar} name={testimonial.name} />
                <div>
                  <p className="text-sm font-semibold testimonials-section-name">
                    {testimonial.name}
                  </p>
                  <p className="text-xs testimonials-section-role">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

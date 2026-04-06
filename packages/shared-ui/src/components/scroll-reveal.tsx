"use client";

import { useEffect, useRef, useState } from "react";

export type AnimationType =
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "none";

const hiddenStyles: Record<AnimationType, React.CSSProperties> = {
  "fade-in": { opacity: 0 },
  "slide-up": { opacity: 0, transform: "translateY(40px)" },
  "slide-left": { opacity: 0, transform: "translateX(-40px)" },
  "slide-right": { opacity: 0, transform: "translateX(40px)" },
  "scale-in": { opacity: 0, transform: "scale(0.9)" },
  none: {},
};

const visibleStyles: React.CSSProperties = {
  opacity: 1,
  transform: "none",
};

const transitionStyle: React.CSSProperties = {
  transition:
    "opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
  willChange: "opacity, transform",
};

export function getRevealStyles(
  animation: AnimationType,
  isVisible: boolean,
): React.CSSProperties {
  if (animation === "none") return {};
  return {
    ...transitionStyle,
    ...(isVisible ? visibleStyles : hiddenStyles[animation]),
  };
}

export function useScrollReveal(animation: AnimationType = "fade-in") {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animation === "none") {
      setIsVisible(true);
      return;
    }

    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation]);

  return { ref, isVisible, style: getRevealStyles(animation, isVisible) };
}

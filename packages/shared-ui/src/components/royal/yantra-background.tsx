import type { RoyalStyle } from "./types";

/**
 * Full-section overlay with a repeating yantra/paisley SVG pattern.
 * Absolutely positioned, pointer-events-none so it never blocks interaction.
 */
export function YantraBackground({ royalStyle }: { royalStyle: RoyalStyle }) {
  if (royalStyle === "none") return null;

  const opacity = royalStyle === "subtle" ? 0.08 : 0.15;

  // Inline SVG pattern as a data URI for the background
  const patternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <g opacity="1" fill="none" stroke="currentColor" stroke-width="1">
      <!-- Diamond frame -->
      <path d="M40 8L72 40L40 72L8 40Z"/>
      <!-- Inner diamond -->
      <path d="M40 20L60 40L40 60L20 40Z"/>
      <!-- Center circle -->
      <circle cx="40" cy="40" r="8"/>
      <!-- Center dot -->
      <circle cx="40" cy="40" r="2" fill="currentColor"/>
      <!-- Cardinal points -->
      <circle cx="40" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="72" cy="40" r="1.5" fill="currentColor"/>
      <circle cx="40" cy="72" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="40" r="1.5" fill="currentColor"/>
      <!-- Diagonal accents -->
      <path d="M24 24L32 32"/>
      <path d="M56 24L48 32"/>
      <path d="M24 56L32 48"/>
      <path d="M56 56L48 48"/>
      <!-- Small petals at midpoints -->
      <path d="M40 28C42 32 42 36 40 40C38 36 38 32 40 28Z" fill="currentColor" opacity="0.3"/>
      <path d="M52 40C48 42 44 42 40 40C44 38 48 38 52 40Z" fill="currentColor" opacity="0.3"/>
    </g>
  </svg>`;

  const encodedSvg = `data:image/svg+xml,${encodeURIComponent(patternSvg)}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity,
        backgroundImage: `url("${encodedSvg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "80px 80px",
        color: "var(--royal-gold)",
      }}
      aria-hidden="true"
    />
  );
}

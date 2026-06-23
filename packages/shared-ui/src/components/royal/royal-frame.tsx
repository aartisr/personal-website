import type { RoyalStyle } from "./types";
import "./royal.css";

/**
 * Wraps an image element with a golden double-border frame + optional small corner ornaments.
 * Children should be the <img> or image container.
 */
export function RoyalFrame({
  royalStyle,
  children,
}: {
  royalStyle: RoyalStyle;
  children: React.ReactNode;
}) {
  if (royalStyle === "none") {
    return <>{children}</>;
  }

  const variantClass = royalStyle === "subtle" ? "is-subtle" : "is-ornate";

  return (
    <div className={`royal-frame ${variantClass}`}>
      {/* Outer border */}
      <div className="royal-frame-outer" />
      {/* Inner border */}
      <div className="royal-frame-inner" />
      {/* Content — no opacity applied */}
      <div className="royal-frame-content">
        {children}
      </div>

      {/* Small corner ornaments */}
      {royalStyle === "ornate" && (
        <>
          <FrameCorner position="top-left" variant={variantClass} />
          <FrameCorner position="top-right" variant={variantClass} />
          <FrameCorner position="bottom-left" variant={variantClass} />
          <FrameCorner position="bottom-right" variant={variantClass} />
        </>
      )}
    </div>
  );
}

function FrameCorner({
  position,
  variant,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  variant: "is-subtle" | "is-ornate";
}) {
  return (
    <svg
      className={`royal-frame-corner ${variant} ${position}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2L2 8C2 8 4 6 6 6C8 6 8 8 8 8L8 2Z"
        fill="var(--royal-gold)"
        opacity="0.9"
      />
      <path d="M2 2L10 2" stroke="var(--royal-gold)" strokeWidth="1.5" />
      <path d="M2 2L2 10" stroke="var(--royal-gold)" strokeWidth="1.5" />
    </svg>
  );
}

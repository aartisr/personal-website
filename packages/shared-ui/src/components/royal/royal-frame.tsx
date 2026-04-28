import type { RoyalStyle } from "./types";

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

  const borderWidth = royalStyle === "subtle" ? 2 : 3;
  const gap = royalStyle === "subtle" ? 4 : 6;
  const borderOpacity = royalStyle === "subtle" ? 0.5 : 0.85;
  const cornerSize = royalStyle === "subtle" ? 16 : 24;

  return (
    <div
      className="relative"
      style={{
        padding: `${gap + borderWidth}px`,
        borderRadius: "1rem",
      }}
    >
      {/* Outer border */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `${borderWidth}px solid var(--royal-gold)`,
          opacity: borderOpacity,
        }}
      />
      {/* Inner border */}
      <div
        className="absolute rounded-lg pointer-events-none"
        style={{
          top: gap,
          left: gap,
          right: gap,
          bottom: gap,
          border: `${Math.max(1, borderWidth - 1)}px solid var(--royal-gold)`,
          opacity: borderOpacity * 0.7,
        }}
      />
      {/* Content — no opacity applied */}
      <div className="relative overflow-hidden rounded-lg">
        {children}
      </div>

      {/* Small corner ornaments */}
      {royalStyle === "ornate" && (
        <>
          <FrameCorner position="top-left" size={cornerSize} />
          <FrameCorner position="top-right" size={cornerSize} />
          <FrameCorner position="bottom-left" size={cornerSize} />
          <FrameCorner position="bottom-right" size={cornerSize} />
        </>
      )}
    </div>
  );
}

function FrameCorner({
  position,
  size,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size: number;
}) {
  const posStyles: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    zIndex: 2,
    pointerEvents: "none",
  };

  if (position === "top-left") {
    posStyles.top = -2;
    posStyles.left = -2;
  } else if (position === "top-right") {
    posStyles.top = -2;
    posStyles.right = -2;
    posStyles.transform = "scaleX(-1)";
  } else if (position === "bottom-left") {
    posStyles.bottom = -2;
    posStyles.left = -2;
    posStyles.transform = "scaleY(-1)";
  } else {
    posStyles.bottom = -2;
    posStyles.right = -2;
    posStyles.transform = "scale(-1)";
  }

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={posStyles}
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

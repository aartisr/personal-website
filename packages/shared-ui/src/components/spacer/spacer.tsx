import React from "react";

export type SpacerHeight = "sm" | "md" | "lg" | "xl";

export type SpacerProps = {
  height: SpacerHeight;
};

const heightMap: Record<SpacerHeight, number> = {
  sm: 32,
  md: 64,
  lg: 96,
  xl: 128,
};

export function Spacer({ height }: SpacerProps) {
  const px = heightMap[height] ?? heightMap.md;
  return (
    <div
      aria-hidden="true"
      role="separator"
      style={{ height: `${px}px`, display: "block", width: "100%" }}
    />
  );
}

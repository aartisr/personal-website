"use client";

import { type AnimationType, useScrollReveal } from "../scroll-reveal";

export type Stat = {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
};

export type StatsCounterProps = {
  stats?: Stat[];
  animation?: AnimationType;
  anchorId?: string;
};

function normalizeStats(stats: unknown): Stat[] {
  if (!Array.isArray(stats)) {
    return [];
  }

  return stats
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      value: typeof item.value === "string" ? item.value : "",
      label: typeof item.label === "string" ? item.label : "",
      prefix: typeof item.prefix === "string" ? item.prefix : "",
      suffix: typeof item.suffix === "string" ? item.suffix : "",
    }));
}

export function StatsCounter({
  stats,
  animation = "scale-in",
  anchorId,
}: StatsCounterProps) {
  const { ref } = useScrollReveal(animation);
  const safeStats = normalizeStats(stats);

  return (
    <section
      id={anchorId}
      ref={ref}
      className="relative w-full py-20 px-4 scroll-mt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--primary)_28%,transparent),transparent)]"
      />
      <div className="max-w-5xl mx-auto">
        <div className="mb-7 text-center">
          <p className="text-[11px] uppercase font-semibold text-primary">
            Research Snapshot
          </p>
        </div>
        <dl
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {safeStats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="group relative flex flex-col items-center text-center px-4 py-8 rounded-lg bg-card border border-(--border)/85 shadow-[0_8px_28px_rgba(12,22,48,0.05)] transition-all duration-300 hover:-translate-y-1"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-75"
              />
              <dt className="text-3xl sm:text-4xl md:text-5xl font-extrabold tabular-nums mb-2 text-primary">
                {stat.prefix && (
                  <span className="text-2xl sm:text-3xl md:text-4xl">{stat.prefix}</span>
                )}
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl sm:text-3xl md:text-4xl">{stat.suffix}</span>
                )}
              </dt>
              <dd className="text-sm font-medium uppercase text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

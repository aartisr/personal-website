"use client";

import { type AnimationType, useScrollReveal } from "../scroll-reveal";
import {
  resolveDynamicMetric,
  useDynamicMetrics,
} from "../dynamic-metrics";

export type Stat = {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
  metricKey?: string;
};

export type StatsCounterProps = {
  anchorId?: string;
  stats?: Stat[];
  animation?: AnimationType;
  topSpacing?: "compact" | "normal" | "relaxed";
  bottomSpacing?: "compact" | "normal" | "relaxed";
  dynamicMetricsEndpoint?: string;
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
      metricKey: typeof item.metricKey === "string" ? item.metricKey : "",
    }));
}

const topSpacingClasses = {
  compact: "pt-6 sm:pt-7 lg:pt-8",
  normal: "pt-14 sm:pt-16 lg:pt-20",
  relaxed: "pt-20 sm:pt-24 lg:pt-28",
};

const bottomSpacingClasses = {
  compact: "pb-5 sm:pb-6 lg:pb-6",
  normal: "pb-14 sm:pb-16 lg:pb-20",
  relaxed: "pb-20 sm:pb-24 lg:pb-28",
};

export function StatsCounter({
  anchorId,
  stats,
  animation = "scale-in",
  topSpacing = "normal",
  bottomSpacing = "normal",
  dynamicMetricsEndpoint = "/api/github-stats",
}: StatsCounterProps) {
  const { ref, style } = useScrollReveal(animation);
  const safeStats = normalizeStats(stats);
  const hasDynamicMetrics = safeStats.some((stat) => stat.metricKey);
  const metrics = useDynamicMetrics(dynamicMetricsEndpoint, hasDynamicMetrics);
  const renderedStats = safeStats.map((stat) => {
    const dynamicMetric = resolveDynamicMetric(metrics, stat.metricKey);
    if (!dynamicMetric) {
      return stat;
    }

    return {
      ...stat,
      value:
        dynamicMetric.value === undefined
          ? stat.value
          : String(dynamicMetric.value),
      prefix: dynamicMetric.prefix ?? stat.prefix,
      suffix: dynamicMetric.suffix ?? stat.suffix,
      label: dynamicMetric.label ?? stat.label,
    };
  });

  return (
    <section
      id={anchorId || undefined}
      ref={ref}
      style={style}
      className={`relative w-full scroll-mt-24 px-4 ${topSpacingClasses[topSpacing] ?? topSpacingClasses.normal} ${bottomSpacingClasses[bottomSpacing] ?? bottomSpacingClasses.normal}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_8%,transparent),transparent)]"
      />
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-primary">
            Snapshot Metrics
          </p>
        </div>
        <dl
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-3 sm:gap-4 lg:gap-5"
          aria-live={hasDynamicMetrics ? "polite" : undefined}
        >
          {renderedStats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="group relative flex min-h-34 flex-col items-center justify-center text-center px-4 py-5 rounded-lg bg-card border border-(--border)/85 shadow-[0_8px_28px_rgba(12,22,48,0.06)] transition-all duration-300 hover:-translate-y-1"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-75"
              />
              <dt className="mb-1.5 min-h-10 whitespace-nowrap text-3xl sm:text-4xl font-extrabold tracking-normal tabular-nums text-primary">
                {stat.prefix && (
                  <span className="text-2xl sm:text-3xl">{stat.prefix}</span>
                )}
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
                )}
              </dt>
              <dd className="max-w-38 text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

"use client";

import { type AnimationType, useScrollReveal, getRevealStyles } from "../scroll-reveal";

export type Stat = {
  value: string;
  label: string;
  prefix: string;
  suffix: string;
};

export type StatsCounterProps = {
  stats: Stat[];
  animation?: AnimationType;
};

export function StatsCounter({ stats, animation = "scale-in" }: StatsCounterProps) {
  const { ref, isVisible } = useScrollReveal(animation);

  return (
    <section ref={ref} className="w-full py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <dl
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4 py-8 rounded-2xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                ...getRevealStyles(animation, isVisible),
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <dt
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums mb-2"
                style={{ color: "var(--primary)" }}
              >
                {stat.prefix && (
                  <span className="text-2xl sm:text-3xl md:text-4xl">{stat.prefix}</span>
                )}
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl sm:text-3xl md:text-4xl">{stat.suffix}</span>
                )}
              </dt>
              <dd
                className="text-sm font-medium uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

"use client";

import { ArrowUpRight, Award, BadgeCheck, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

export const recognitionCategories = [
  "Innovation & AI",
  "Math & science",
  "Community problem-solving",
  "School & regional fairs",
] as const;

export type RecognitionCategory = (typeof recognitionCategories)[number];

export type RecognitionItem = {
  title: string;
  issuer: string;
  year?: string;
  location?: string;
  category: RecognitionCategory;
  recognition: string;
  project?: string;
  note?: string;
  evidenceUrl?: string;
  evidenceLabel?: string;
  verification?: "Documented" | "Official source pending";
};

export type RecognitionLedgerProps = {
  anchorId?: string;
  eyebrow?: string;
  heading: string;
  description: string;
  records?: RecognitionItem[];
  verificationNote?: string;
};

function isRecognitionCategory(value: unknown): value is RecognitionCategory {
  return typeof value === "string" && recognitionCategories.includes(value as RecognitionCategory);
}

function safeRecords(value: RecognitionItem[] | undefined): RecognitionItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (record) =>
      record &&
      typeof record.title === "string" &&
      record.title.trim() &&
      typeof record.issuer === "string" &&
      record.issuer.trim() &&
      isRecognitionCategory(record.category) &&
      typeof record.recognition === "string" &&
      record.recognition.trim(),
  );
}

export function RecognitionLedger({
  anchorId = "recognition-record",
  eyebrow,
  heading,
  description,
  records,
  verificationNote = "Each entry is published with its issuer, scope, project context, and an evidence path where public sharing is appropriate.",
}: RecognitionLedgerProps) {
  const [activeCategory, setActiveCategory] = useState<RecognitionCategory | "All">("All");
  const items = useMemo(() => safeRecords(records), [records]);
  const visibleItems = activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);

  return (
    <section id={anchorId || undefined} className="scroll-mt-24 border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_7%,transparent),transparent_48%),var(--card)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>}
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">{heading}</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">{description}</p>
        </div>

        <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-[0_14px_36px_rgba(12,22,48,.06)] sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true"><BadgeCheck size={18} /></span>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Evidence standard.</span> {verificationNote}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground" aria-live="polite">{visibleItems.length} recognition{visibleItems.length === 1 ? "" : "s"} shown</p>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Filter recognition records">
          <FilterButton active={activeCategory === "All"} label="All recognition" onClick={() => setActiveCategory("All")} />
          {recognitionCategories.map((category) => <FilterButton key={category} active={activeCategory === category} label={category} onClick={() => setActiveCategory(category)} />)}
        </div>

        <ol className="mt-7 grid gap-4 md:grid-cols-2">
          {visibleItems.map((item) => (
            <li key={`${item.issuer}-${item.title}-${item.year ?? ""}`}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 shadow-[0_10px_28px_rgba(12,22,48,.045)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-primary">{item.category}</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug text-foreground">{item.title}</h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary" aria-hidden="true"><Award size={19} /></span>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{item.issuer}</p>
                {(item.year || item.location) && <p className="mt-1 text-sm text-muted-foreground">{[item.year, item.location].filter(Boolean).join(" · ")}</p>}
                <p className="mt-5 text-sm leading-6 text-muted-foreground">{item.recognition}</p>
                {item.project && <p className="mt-4 border-l-2 border-primary/65 pl-3 text-sm leading-6 text-foreground"><span className="font-semibold">Project context:</span> {item.project}</p>}
                {item.note && <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.note}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.verification === "Documented" ? "bg-emerald-50 text-emerald-800" : "bg-muted text-muted-foreground"}`}>{item.verification ?? "Official source pending"}</span>
                  {item.evidenceUrl && <a href={item.evidenceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-primary no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">{item.evidenceLabel || "Open evidence"}<ExternalLink size={15} aria-hidden="true" /></a>}
                </div>
              </article>
            </li>
          ))}
        </ol>

        {visibleItems.length === 0 && <div className="mt-7 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">No recognition records match this focus yet.</div>}
        <a href="#recognition-method" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">How this record is maintained <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary"}`}>{label}</button>;
}

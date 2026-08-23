"use client";

import { ArrowRight, ArrowUpRight, CircleDashed, MonitorPlay, X } from "lucide-react";
import { useMemo, useState } from "react";
import { isExternalHref } from "../../utils/links";

export const communityProjectCategories = [
  "Learning & students",
  "Environment & science",
  "Civic & community",
  "Wellbeing & health",
  "Digital systems",
] as const;

export type CommunityProjectCategory = (typeof communityProjectCategories)[number];

export type CommunityChallengeProject = {
  name: string;
  challenge: string;
  contribution: string;
  evidenceState: string;
  href: string;
  /** Optional live product or public experience, distinct from the evidence record. */
  liveHref?: string;
  liveLabel?: string;
  /** Optional editorial override. A useful category is inferred when omitted. */
  category?: CommunityProjectCategory;
};

export type CommunityChallengeLedgerProps = {
  anchorId?: string;
  eyebrow?: string;
  heading: string;
  description: string;
  projects?: CommunityChallengeProject[];
};

const initialProjectCount = 6;

const categoryDescriptions: Record<CommunityProjectCategory, string> = {
  "Learning & students": "Learning tools, school projects, and student-facing systems.",
  "Environment & science": "Research exploring climate, place, materials, and scientific inquiry.",
  "Civic & community": "Public understanding, transit, organizations, and community connection.",
  "Wellbeing & health": "Support pathways, reflective practice, and evidence-aware health work.",
  "Digital systems": "Reusable software, public infrastructure, and technical experiments.",
};

function inferCategory(project: CommunityChallengeProject): CommunityProjectCategory {
  if (project.category && communityProjectCategories.includes(project.category)) {
    return project.category;
  }

  const searchable = `${project.name} ${project.challenge} ${project.contribution}`.toLowerCase();

  if (/resilien|wellbeing|reflection|medical|health/.test(searchable)) {
    return "Wellbeing & health";
  }

  if (/heat|spectral|environment|fractal|orbital|material|science/.test(searchable)) {
    return "Environment & science";
  }

  if (/student|learning|school|robotics|mathematical|quadratic|study/.test(searchable)) {
    return "Learning & students";
  }

  if (/transit|civic|governance|foundation|city|charit|autograph|community/.test(searchable)) {
    return "Civic & community";
  }

  return "Digital systems";
}

export function CommunityChallengeLedger({
  anchorId = "community-work",
  eyebrow,
  heading,
  description,
  projects = [],
}: CommunityChallengeLedgerProps) {
  const [activeCategory, setActiveCategory] = useState<CommunityProjectCategory | "All">("All");
  const [showAll, setShowAll] = useState(false);
  const [previewProject, setPreviewProject] = useState<CommunityChallengeProject | null>(null);

  const items = useMemo(
    () =>
      projects
        .filter(
          (project) =>
            project?.name && project?.challenge && project?.contribution && project?.href
        )
        .map((project) => ({ ...project, category: inferCategory(project) })),
    [projects]
  );

  const categoryCounts = useMemo(
    () =>
      communityProjectCategories.reduce<Record<CommunityProjectCategory, number>>(
        (counts, category) => ({
          ...counts,
          [category]: items.filter((project) => project.category === category).length,
        }),
        {} as Record<CommunityProjectCategory, number>
      ),
    [items]
  );

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((project) => project.category === activeCategory);
  const visibleItems = showAll || activeCategory !== "All" ? filteredItems : filteredItems.slice(0, initialProjectCount);
  const hiddenProjectCount = filteredItems.length - visibleItems.length;

  function selectCategory(category: CommunityProjectCategory | "All") {
    setActiveCategory(category);
    setShowAll(category !== "All");
  }

  return (
    <section
      id={anchorId || undefined}
      className="border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_38%,transparent),transparent_48%)] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">
            {description}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_rgba(12,22,48,0.1)] sm:p-6">
          <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Browse by focus</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Start with the questions closest to your interests, then open the full record when useful.
              </p>
            </div>
            <p className="text-sm font-medium tabular-nums text-muted-foreground" aria-live="polite">
              Showing {visibleItems.length} of {filteredItems.length} projects
            </p>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filter portfolio projects">
            <FilterButton
              active={activeCategory === "All"}
              count={items.length}
              label="All projects"
              onClick={() => selectCategory("All")}
            />
            {communityProjectCategories.map((category) => (
              <FilterButton
                key={category}
                active={activeCategory === category}
                count={categoryCounts[category]}
                label={category}
                onClick={() => selectCategory(category)}
              />
            ))}
          </div>

          {activeCategory !== "All" && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {categoryDescriptions[activeCategory]}
            </p>
          )}

          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((project) => (
              <li key={project.name} className="min-w-0">
                <article className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                      {project.category}
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{project.name}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-foreground/85">{project.challenge}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.contribution}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                    {project.liveHref && (
                      <button
                        type="button"
                        onClick={() => setPreviewProject(project)}
                        aria-label={`Preview ${project.name} in this page`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <MonitorPlay size={14} aria-hidden="true" />
                        Preview live
                      </button>
                    )}
                    <a
                      href={project.href}
                      target={isExternalHref(project.href) ? "_blank" : undefined}
                      rel={isExternalHref(project.href) ? "noopener noreferrer" : undefined}
                      aria-label={`View ${project.name} evidence (opens in a new tab)`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <CircleDashed size={14} aria-hidden="true" />
                      {project.evidenceState}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {hiddenProjectCount > 0 && (
            <div className="mt-6 flex justify-center border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Show {hiddenProjectCount} more {hiddenProjectCount === 1 ? "project" : "projects"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {previewProject?.liveHref && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="live-preview-title"
        >
          <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl sm:mx-auto sm:max-w-6xl sm:rounded-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Interactive preview</p>
                <h3 id="live-preview-title" className="truncate text-base font-semibold text-foreground">
                  {previewProject.name}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={previewProject.liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground no-underline hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Open full site <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewProject(null)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close live preview"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <iframe
              key={previewProject.liveHref}
              src={previewProject.liveHref}
              title={`${previewProject.name} live preview`}
              className="min-h-[65vh] w-full bg-muted"
              sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function FilterButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${active ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground"}`}>
        {count}
      </span>
    </button>
  );
}

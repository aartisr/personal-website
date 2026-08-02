import { ArrowUpRight, CircleDashed } from "lucide-react";

export type CommunityChallengeProject = {
  name: string;
  challenge: string;
  contribution: string;
  evidenceState: string;
  href: string;
};

export type CommunityChallengeLedgerProps = {
  anchorId?: string;
  eyebrow?: string;
  heading: string;
  description: string;
  projects?: CommunityChallengeProject[];
};

export function CommunityChallengeLedger({
  anchorId = "community-work",
  eyebrow,
  heading,
  description,
  projects = [],
}: CommunityChallengeLedgerProps) {
  const items = projects.filter(
    (project) => project?.name && project?.challenge && project?.contribution
  );

  return (
    <section id={anchorId || undefined} className="border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_38%,transparent),transparent_48%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">{heading}</h2>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">{description}</p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_45px_rgba(12,22,48,0.1)]">
          <div className="grid grid-cols-[1.1fr_1.5fr_1.5fr_auto] gap-4 border-b border-border bg-muted/45 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-6">
            <span>Project</span><span>Community challenge</span><span>Contribution</span><span className="sr-only">Evidence</span>
          </div>
          <ul className="divide-y divide-border">
            {items.map((project) => (
              <li key={project.name}>
                <a href={project.href} target="_blank" rel="noreferrer" className="grid gap-3 border-l-4 border-transparent px-5 py-5 no-underline transition-all hover:border-primary hover:bg-primary/[0.045] sm:grid-cols-[1.1fr_1.5fr_1.5fr_auto] sm:gap-4 sm:px-6">
                  <span className="font-semibold text-foreground">{project.name}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{project.challenge}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{project.contribution}</span>
                  <span className="inline-flex items-start gap-1.5 text-xs font-medium text-primary"><CircleDashed size={14} aria-hidden="true" />{project.evidenceState}<ArrowUpRight size={14} aria-hidden="true" /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

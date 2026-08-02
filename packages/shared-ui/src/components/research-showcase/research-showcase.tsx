import { ArrowUpRight, FileText, Microscope } from "lucide-react";

export type ResearchShowcaseItem = {
  eyebrow?: string;
  status?: string;
  title: string;
  description: string;
  question?: string;
  method?: string;
  evidence?: string;
  outcome?: string;
  limitation?: string;
  nextStep?: string;
  lastUpdated?: string;
  href?: string;
  tags?: string;
};

export type ResearchShowcaseProps = {
  anchorId?: string;
  eyebrow?: string;
  heading: string;
  description: string;
  items?: ResearchShowcaseItem[];
};

function splitTags(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeItems(items?: ResearchShowcaseItem[]): ResearchShowcaseItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter((item) => item?.title && item?.description);
}

export function ResearchShowcase({
  anchorId = "research",
  eyebrow,
  heading,
  description,
  items,
}: ResearchShowcaseProps) {
  const safeItems = normalizeItems(items);

  return (
    <section
      id={anchorId || undefined}
      className="w-full scroll-mt-24 border-b border-border/70 bg-card/72 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">
              {description}
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {safeItems.map((item, index) => {
            const tags = splitTags(item.tags);
            const content = (
              <article className="flex h-full flex-col border border-border bg-background p-5 shadow-[0_10px_30px_rgba(12,22,48,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/60">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    {item.eyebrow && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {item.eyebrow}
                      </p>
                    )}
                    {item.status && (
                      <p className="mt-2 inline-flex rounded-md border border-border px-2 py-1 text-xs font-semibold text-primary">
                        {item.status}
                      </p>
                    )}
                  </div>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary"
                    aria-hidden="true"
                  >
                    {index === 0 ? <Microscope size={18} /> : <FileText size={18} />}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>

                <dl className="mt-6 grid gap-3 border-t border-border pt-5">
                  {item.question && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Research question
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.question}
                      </dd>
                    </div>
                  )}
                  {item.method && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Method
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.method}
                      </dd>
                    </div>
                  )}
                  {item.evidence && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Evidence
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.evidence}
                      </dd>
                    </div>
                  )}
                  {item.outcome && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Outcome
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.outcome}
                      </dd>
                    </div>
                  )}
                  {item.limitation && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Current limit
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.limitation}
                      </dd>
                    </div>
                  )}
                  {item.nextStep && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Next test
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-foreground">
                        {item.nextStep}
                      </dd>
                    </div>
                  )}
                </dl>

                {tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${item.title} tags`}>
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  {item.lastUpdated && (
                    <span className="text-xs text-muted-foreground">
                      Updated {item.lastUpdated}
                    </span>
                  )}
                  {item.href && (
                    <span className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Open evidence
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  )}
                </div>
              </article>
            );

            return item.href ? (
              <a
                key={`${item.title}-${index}`}
                href={item.href}
                className="block text-inherit no-underline"
              >
                {content}
              </a>
            ) : (
              <div key={`${item.title}-${index}`}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

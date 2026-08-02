import { ArrowRight, Building2, HeartHandshake, GraduationCap } from "lucide-react";

export type AudienceRoute = { label: string; description: string; href: string; action: string };
export type AudienceRouterProps = { anchorId?: string; eyebrow?: string; heading: string; description?: string; routes?: AudienceRoute[] };

const icons = [GraduationCap, Building2, HeartHandshake];

export function AudienceRouter({ anchorId = "start-here", eyebrow, heading, description, routes = [] }: AudienceRouterProps) {
  return <section id={anchorId || undefined} className="border-b border-border bg-primary/[0.035] px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><h2 className="text-2xl font-bold text-foreground sm:text-3xl">{heading}</h2>{description && <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">{routes.slice(0, 3).map((route, index) => { const Icon = icons[index] ?? GraduationCap; return <a key={route.label} href={route.href} className="group rounded-xl border border-border bg-background p-5 shadow-[0_8px_24px_rgba(12,22,48,0.05)] transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_16px_34px_rgba(12,22,48,0.1)]"><Icon className="text-primary" size={22} aria-hidden="true" /><h3 className="mt-4 text-lg font-bold text-foreground">{route.label}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{route.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{route.action}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></a>; })}</div>
    </div>
  </section>;
}

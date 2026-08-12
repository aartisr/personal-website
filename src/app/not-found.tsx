import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Handshake, Search } from "lucide-react";

const nextSteps = [
  { href: "/", label: "Start at the portfolio", detail: "Research, projects, and the company’s point of view.", icon: Compass },
  { href: "/honors-service", label: "Review recognition", detail: "Verified honors and the work behind them.", icon: BookOpen },
  { href: "/blog", label: "Read research notes", detail: "Writing about methods, building, and clear thinking.", icon: Search },
  { href: "/collaborate", label: "Start a conversation", detail: "A focused path for academic, technical, and community collaboration.", icon: Handshake },
];

export default function NotFound() {
  return (
    <section className="min-h-[72vh] bg-[radial-gradient(circle_at_8%_8%,color-mix(in_oklch,var(--accent)_55%,transparent),transparent_22rem),var(--background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary">Page not found · a useful recovery</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-6xl">That route is no longer part of the published record.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">The site has been updated, but the work is still easy to find. Choose a clear next step below, or return to the portfolio.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline">Go to the portfolio <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/support-center" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground no-underline">Get help finding something</Link></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">{nextSteps.map(({ href, label, detail, icon: Icon }) => <Link key={href} href={href} className="group rounded-2xl border border-border bg-background p-5 no-underline shadow-[0_10px_28px_rgba(12,22,48,.04)] transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_16px_36px_rgba(12,22,48,.09)]"><Icon size={21} className="text-primary" aria-hidden="true" /><h2 className="mt-4 flex items-center gap-2 text-lg font-bold text-foreground">{label}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></Link>)}</div>
      </div>
    </section>
  );
}

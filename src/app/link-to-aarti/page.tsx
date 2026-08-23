import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { siteProfile } from "@/lib/seo";

const pagePath = "/link-to-aarti";
const pageUrl = absoluteUrl(pagePath);
const preferredCitation =
  "Ravikumar, Aarti Sri. Aarti Sri Ravikumar: Student Research Portfolio. ai-aarti.com. Accessed [date].";

export const metadata: Metadata = {
  title: "Link to Aarti Sri Ravikumar | Citation & Media Kit",
  description:
    "Official citation, attribution, and media information for linking to Aarti Sri Ravikumar's student research portfolio and public project work.",
  alternates: { canonical: pagePath },
  openGraph: {
    title: "Link to Aarti Sri Ravikumar | Citation & Media Kit",
    description:
      "Official citation, attribution, and media information for Aarti Sri Ravikumar's public student research portfolio.",
    type: "profile",
    url: pageUrl,
    siteName: siteProfile.name,
    images: [{ url: absoluteUrl(siteProfile.socialImagePath), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link to Aarti Sri Ravikumar | Citation & Media Kit",
    description:
      "Official citation and attribution information for Aarti Sri Ravikumar's public research portfolio.",
    images: [absoluteUrl(siteProfile.socialImagePath)],
  },
};

export default function LinkToAartiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: "Link to Aarti Sri Ravikumar | Citation & Media Kit",
    description: metadata.description,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl("/")}#person` },
    mainEntity: {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: siteProfile.name,
      url: absoluteUrl("/"),
      sameAs: [siteProfile.githubUrl],
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Aarti Sri Ravikumar&apos;s portfolio
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Citation & media kit
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Link to Aarti Sri Ravikumar
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Thank you for referencing this public student research portfolio. This page
          provides the authoritative URL, a concise factual description, and clear
          attribution language for educators, collaborators, journalists, and project
          directories.
        </p>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Use this canonical link</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Please link to the homepage when identifying Aarti Sri Ravikumar or her
            overall body of work. Link directly to a specific project, article, or
            framework when describing that item.
          </p>
          <p className="mt-4 rounded-lg border border-border bg-card p-4 font-mono text-sm break-all">
            {absoluteUrl("/")}
          </p>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Suggested attribution</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Use the full name on first reference. Descriptive anchors help readers
            understand where a link leads; avoid generic anchors such as “click here.”
          </p>
          <blockquote className="mt-4 rounded-lg border-l-4 border-primary bg-card p-5 leading-7">
            <p>{preferredCitation}</p>
          </blockquote>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Good link text: “Aarti Sri Ravikumar&apos;s student research portfolio,”
            “Aarti Sri Ravikumar&apos;s research-informed software projects,” or the
            title of the specific resource being cited.
          </p>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Short factual description</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Aarti Sri Ravikumar is a student researcher, software project builder, and
            technical writer at Pioneer Charter School of Science II in Saugus,
            Massachusetts. Her public work documents research-informed software,
            resilient learning systems, civic and environmental inquiry, and evidence-
            based communication.
          </p>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Best pages to reference</h2>
          <ul className="mt-4 space-y-3 leading-7 text-muted-foreground">
            <li><Link className="text-primary hover:underline" href="/">Portfolio homepage</Link> — identity, methods, and public project evidence.</li>
            <li><Link className="text-primary hover:underline" href="/aether-framework">Aether Student Resiliency Framework</Link> — framework scope, limitations, and source artifact.</li>
            <li><Link className="text-primary hover:underline" href="/blog">Research notes and field memos</Link> — authored writing on research and software practice.</li>
            <li><Link className="text-primary hover:underline" href="/honors-service">Honors and service</Link> — recognition and community context.</li>
            <li><a className="text-primary hover:underline" href={siteProfile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub profile</a> — public source repositories and implementation evidence.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">For publications and directories</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Please preserve the author name, use the canonical URL above, and link to
            the most specific supporting page available. Do not imply awards,
            institutional endorsement, admissions outcomes, or credentials that are not
            stated on the linked page. For collaboration or a factual question, use the
            <Link className="text-primary hover:underline" href="/support-center">support center</Link>.
          </p>
        </section>
      </article>
    </main>
  );
}

import Link from "next/link";

export default function GlobalLayoutHubPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-bold text-foreground">Global Layout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit Header and Footer separately. Changes apply across all pages.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/edit/layout/header"
          className="rounded-lg border border-border bg-card p-5 no-underline"
        >
          <p className="text-lg font-semibold text-foreground">Header</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit global navigation, brand details, utility links, and top-level CTA controls.
          </p>
        </Link>

        <Link
          href="/admin/edit/layout/footer"
          className="rounded-lg border border-border bg-card p-5 no-underline"
        >
          <p className="text-lg font-semibold text-foreground">Footer</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit footer messaging, columns, social links, legal links, and closing actions.
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/admin" className="text-sm font-semibold text-primary no-underline">
          ← Back to pages
        </Link>
      </div>
    </main>
  );
}

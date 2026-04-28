import Link from "next/link";
import type { Metadata } from "next";
import { BlogListClient } from "@/components/blog/blog-list-client";
import { getAllBlogPosts, getAllBlogTags } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on learning, engineering, and student project execution.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Aarti Sri Ravikumar",
    description:
      "Notes on learning, engineering, and student project execution.",
    type: "website",
    url: absoluteUrl("/blog"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Aarti Sri Ravikumar",
    description:
      "Notes on learning, engineering, and student project execution.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const tags = getAllBlogTags();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium text-[color:var(--primary)]"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-[color:var(--foreground)]">
            Journal
          </h1>
          <p className="mt-3 text-base text-[color:var(--muted-foreground)]">
            Real posts about projects, research, writing, and technical execution.
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            {posts.length} published posts • {tags.length} active themes
          </p>
        </div>

        <BlogListClient posts={posts} tags={tags} />

        <section className="mt-10 rounded-lg border p-6 border-[color:var(--border)] bg-[var(--card)]">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
            Academic & Collaboration Updates
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            For project collaborations, mentorship, or research dialogue, use the support center.
          </p>
          <div className="mt-3">
            <Link href="/support-center" className="text-sm font-semibold text-[color:var(--primary)]">
              Go to Support Center →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

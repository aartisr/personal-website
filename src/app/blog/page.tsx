import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Aarti Sri Ravikumar",
  description:
    "Notes on learning, engineering, and student project execution.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            ← Back to Home
          </Link>
          <h1
            className="mt-4 text-4xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Blog
          </h1>
          <p className="mt-3 text-base" style={{ color: "var(--muted-foreground)" }}>
            Real posts about projects, research, and what I’m learning.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border p-6"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <time
                dateTime={post.date}
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                {formatDate(post.date)}
              </time>
              <h2 className="mt-2 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3" style={{ color: "var(--muted-foreground)" }}>
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {post.author ?? "Aarti Sri Ravikumar"}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Read post →
                </Link>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <p style={{ color: "var(--muted-foreground)" }}>
              No posts yet. Add JSON files in `content/blog` to publish.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

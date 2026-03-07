"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

type BlogListClientProps = {
  posts: BlogPost[];
  tags: string[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogListClient({ posts, tags }: BlogListClientProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag =
        activeTag === "all" || (post.tags ?? []).includes(activeTag);

      if (!matchesTag) {
        return false;
      }

      if (!lowerQuery) {
        return true;
      }

      return [post.title, post.excerpt, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(lowerQuery);
    });
  }, [activeTag, posts, query]);

  return (
    <>
      <div
        className="rounded-xl border p-4 md:p-5 mb-8"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <input
          id="blog-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts, themes, or tags..."
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
          style={{
            borderColor: "var(--border)",
            background: "var(--background)",
            color: "var(--foreground)",
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className="text-xs rounded-full px-3 py-1.5 border"
            style={{
              borderColor: "var(--border)",
              color:
                activeTag === "all"
                  ? "var(--primary)"
                  : "var(--muted-foreground)",
            }}
          >
            All Topics
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className="text-xs rounded-full px-3 py-1.5 border"
              style={{
                borderColor: "var(--border)",
                color:
                  activeTag === tag
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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

        {filteredPosts.length === 0 && (
          <p style={{ color: "var(--muted-foreground)" }}>
            No posts matched your search. Try a different topic or keyword.
          </p>
        )}
      </div>
    </>
  );
}

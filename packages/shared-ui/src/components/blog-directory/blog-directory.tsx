"use client";

import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BlogPost = { slug: string; title: string; excerpt: string; date: string; author?: string; tags?: string[] };
type BlogDirectoryProps = { anchorId?: string; heading: string; description?: string; emptyMessage?: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function BlogDirectory({ anchorId = "articles", heading, description, emptyMessage = "No published posts match this search yet." }: BlogDirectoryProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data: unknown) => setPosts(Array.isArray(data) ? data as BlogPost[] : []))
      .catch(() => setPosts([]))
      .finally(() => setReady(true));
  }, []);

  const tags = useMemo(() => [...new Set(posts.flatMap((post) => post.tags ?? []))].sort(), [posts]);
  const visiblePosts = useMemo(() => {
    const phrase = query.trim().toLowerCase();
    return posts.filter((post) => (activeTag === "all" || post.tags?.includes(activeTag)) && (!phrase || [post.title, post.excerpt, ...(post.tags ?? [])].join(" ").toLowerCase().includes(phrase)));
  }, [activeTag, posts, query]);

  return <section id={anchorId || undefined} className="scroll-mt-24 border-b border-border/70 bg-card px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="max-w-3xl"><h2 className="text-3xl font-bold text-foreground sm:text-4xl">{heading}</h2>{description && <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>}</div>
      <div className="mt-8 rounded-2xl border border-border bg-background p-4 sm:p-5">
        <label htmlFor="puck-blog-search" className="sr-only">Search published research notes</label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3"><Search size={18} className="text-muted-foreground" aria-hidden="true" /><input id="puck-blog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search research notes, themes, or tags…" className="w-full bg-transparent py-3 text-sm text-foreground outline-none" /></div>
        <div className="mt-4 flex flex-wrap gap-2"><Tag active={activeTag === "all"} label="All topics" onClick={() => setActiveTag("all")} />{tags.map((tag) => <Tag key={tag} active={activeTag === tag} label={tag} onClick={() => setActiveTag(tag)} />)}</div>
      </div>
      <div className="mt-6 grid gap-4">
        {!ready && <p className="text-sm text-muted-foreground">Loading published notes…</p>}
        {ready && visiblePosts.map((post) => <article key={post.slug} className="rounded-2xl border border-border bg-background p-5 shadow-[0_10px_28px_rgba(12,22,48,.04)] sm:p-6"><time dateTime={post.date} className="text-[11px] font-semibold uppercase tracking-[.16em] text-primary">{formatDate(post.date)}</time><h3 className="mt-2 text-2xl font-bold text-foreground"><a href={`/blog/${post.slug}`} className="rounded-sm no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{post.title}</a></h3><p className="mt-3 leading-7 text-muted-foreground">{post.excerpt}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{post.author || "Aarti Sri Ravikumar"}</span><a href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-primary no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Read note <ArrowRight size={16} aria-hidden="true" /></a></div></article>)}
        {ready && visiblePosts.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">{emptyMessage}</p>}
      </div>
    </div>
  </section>;
}

function Tag({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) { return <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-primary"}`}>{label}</button>; }

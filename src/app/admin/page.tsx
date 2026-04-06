"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageEntry {
  slug: string;
  title: string;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const router = useRouter();

  const fetchPages = () => {
    setLoading(true);
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async () => {
    const slug = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) return;

    await fetch(`/api/page/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        root: { props: { title: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) } },
        content: [],
      }),
    });

    setNewSlug("");
    router.push(`/admin/edit/${slug}`);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}" page? This cannot be undone.`)) return;

    await fetch(`/api/page/${slug}`, { method: "DELETE" });
    fetchPages();
  };

  const editPath = (slug: string) =>
    slug === "homepage" ? "/admin/edit" : `/admin/edit/${slug}`;

  const viewPath = (slug: string) =>
    slug === "homepage" ? "/" : `/${slug}`;

  return (
    <div className="mx-auto max-w-200 px-5 py-10 font-sans">
      <h1 className="mb-2 text-[28px] font-bold text-foreground">Pages</h1>
      <p className="mb-8 text-muted-foreground">Manage your site pages. Click a page to edit it in the visual editor.</p>

      {/* Create new page */}
      <div className="mb-8 flex gap-2 rounded-lg border border-border bg-card p-4">
        <input
          type="text"
          placeholder="new-page-slug"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-primary"
        />
        <button
          onClick={handleCreate}
          disabled={!newSlug.trim()}
          className="rounded-md px-5 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-default disabled:bg-blue-300 enabled:cursor-pointer enabled:bg-blue-600"
        >
          + New Page
        </button>
      </div>

      {/* Page list */}
      {loading ? (
        <p className="text-gray-500">Loading pages...</p>
      ) : pages.length === 0 ? (
        <p className="text-gray-500">No pages yet. Create one above.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {pages.map((page) => (
            <div
              key={page.slug}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <div className="text-[15px] font-semibold text-foreground">{page.title}</div>
                <div className="text-[13px] text-gray-500">/{page.slug === "homepage" ? "" : page.slug}</div>
              </div>
              <div className="flex gap-2">
                <a
                  href={viewPath(page.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-[13px] text-gray-700 no-underline"
                >
                  View
                </a>
                <button
                  onClick={() => router.push(editPath(page.slug))}
                  className="cursor-pointer rounded-md bg-blue-600 px-3.5 py-1.5 text-[13px] font-semibold text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(page.slug)}
                  className="cursor-pointer rounded-md border border-red-300 bg-white px-3.5 py-1.5 text-[13px] text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

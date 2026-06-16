"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPathFromSlug, editorPathFromSlug, normalizePageSlug, viewPathFromSlug } from "@/lib/page-slug";
import { createDefaultPageData } from "@/lib/puck-page-factory";

interface PageEntry {
  slug: string;
  title: string;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const router = useRouter();

  const fetchPages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pages", { cache: "no-store" });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          body || `Failed to load pages (HTTP ${response.status})`
        );
      }

      const data = (await response.json()) as unknown;
      setPages(Array.isArray(data) ? (data as PageEntry[]) : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load pages.";
      setPages([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async () => {
    const slug = normalizePageSlug(newSlug);

    if (!slug || slug === "homepage") return;

    await fetch(apiPathFromSlug(slug), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createDefaultPageData(slug)),
    });

    setNewSlug("");
    router.push(editorPathFromSlug(slug));
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}" page? This cannot be undone.`)) return;

    await fetch(apiPathFromSlug(slug), { method: "DELETE" });
    fetchPages();
  };

  return (
    <div className="mx-auto max-w-200 px-5 py-10 font-sans">
      <h1 className="mb-2 text-[28px] font-bold text-foreground">Pages</h1>
      <p className="mb-8 text-muted-foreground">Manage your site pages. Click a page to edit it in the visual editor.</p>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
        <div>
          <div className="text-[15px] font-semibold text-foreground">Global Header & Footer</div>
          <div className="text-[13px] text-gray-500">Single source of truth shared by every page. Edit each independently.</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/edit/layout/header")}
            className="cursor-pointer rounded-md bg-blue-600 px-3.5 py-1.5 text-[13px] font-semibold text-white"
          >
            Edit Header
          </button>
          <button
            onClick={() => router.push("/admin/edit/layout/footer")}
            className="cursor-pointer rounded-md border border-border bg-card px-3.5 py-1.5 text-[13px] font-semibold text-foreground"
          >
            Edit Footer
          </button>
        </div>
      </div>

      {/* Create new page */}
      <div className="mb-8 flex gap-2 rounded-lg border border-border bg-card p-4">
        <input
          type="text"
          placeholder="new-page or docs/new-page"
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
      ) : error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Unable to load pages</p>
          <p className="mt-1">{error}</p>
          <p className="mt-1">
            If this mentions authentication or configuration, verify <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> are set and then reload.
          </p>
        </div>
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
                  href={viewPathFromSlug(page.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-[13px] text-gray-700 no-underline"
                >
                  View
                </a>
                <button
                  onClick={() => router.push(editorPathFromSlug(page.slug))}
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

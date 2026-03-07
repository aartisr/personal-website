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
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Pages</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Manage your site pages. Click a page to edit it in the visual editor.</p>

      {/* Create new page */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          padding: 16,
          background: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
        }}
      >
        <input
          type="text"
          placeholder="new-page-slug"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleCreate}
          disabled={!newSlug.trim()}
          style={{
            padding: "8px 20px",
            background: newSlug.trim() ? "#2563eb" : "#93c5fd",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: newSlug.trim() ? "pointer" : "default",
          }}
        >
          + New Page
        </button>
      </div>

      {/* Page list */}
      {loading ? (
        <p style={{ color: "#999" }}>Loading pages...</p>
      ) : pages.length === 0 ? (
        <p style={{ color: "#999" }}>No pages yet. Create one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pages.map((page) => (
            <div
              key={page.slug}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{page.title}</div>
                <div style={{ fontSize: 13, color: "#999" }}>/{page.slug === "homepage" ? "" : page.slug}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={viewPath(page.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    textDecoration: "none",
                    color: "#374151",
                    background: "#fff",
                  }}
                >
                  View
                </a>
                <button
                  onClick={() => router.push(editPath(page.slug))}
                  style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(page.slug)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    background: "#fff",
                    color: "#dc2626",
                    border: "1px solid #fca5a5",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
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

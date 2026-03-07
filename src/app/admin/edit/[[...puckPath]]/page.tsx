"use client";

import { Puck, usePuck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck-config";

function resolveSlugFromPath(puckPath?: string[]): string {
  if (!puckPath || puckPath.length === 0) return "homepage";
  return puckPath.join("-");
}

function slugToTitle(slug: string): string {
  if (slug === "homepage") return "Homepage";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function viewPath(slug: string): string {
  return slug === "homepage" ? "/" : `/${slug}`;
}

let idCounter = 0;
function generateId(type: string): string {
  return `${type}-${Date.now()}-${++idCounter}`;
}

function ensureContentIds(data: Data): Data {
  const content = data.content.map((item) => {
    if (item.props?.id) return item;
    return {
      ...item,
      props: {
        ...item.props,
        id: generateId(item.type),
      },
    };
  });
  return { ...data, content };
}

/* ── Header action buttons injected into the Puck toolbar ── */
function PreviewButton() {
  const { dispatch } = usePuck();
  const [previewing, setPreviewing] = useState(false);

  return (
    <button
      onClick={() => {
        const next = !previewing;
        setPreviewing(next);
        dispatch({
          type: "setUi",
          ui: next
            ? {
                previewMode: "interactive",
                leftSideBarVisible: false,
                rightSideBarVisible: false,
              }
            : {
                previewMode: "edit",
                leftSideBarVisible: true,
                rightSideBarVisible: true,
              },
        });
      }}
      style={{
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        border: previewing ? "1px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: 6,
        background: previewing ? "#eff6ff" : "#fff",
        color: previewing ? "#2563eb" : "#374151",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {previewing ? "✕ Exit Preview" : "▶ Preview"}
    </button>
  );
}

export default function EditorPage() {
  const params = useParams<{ puckPath?: string[] }>();
  const router = useRouter();
  const slug = resolveSlugFromPath(params.puckPath);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(`/api/page/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        const pageData = d || {
          root: { props: {} },
          content: [],
        };
        setData(ensureContentIds(pageData));
        setLoading(false);
      });
  }, [slug]);

  const handlePublish = useCallback(
    async (publishData: Data) => {
      await fetch(`/api/page/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishData),
      });
      setData(publishData);
    },
    [slug]
  );

  if (loading || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <Puck
      key={slug}
      config={puckConfig}
      data={data}
      onPublish={handlePublish}
      viewports={[
        { width: 375, label: "Mobile", icon: <span>📱</span> },
        { width: 768, label: "Tablet", icon: <span>📋</span> },
        { width: 1280, label: "Desktop", icon: <span>🖥</span> },
      ]}
      overrides={{
        headerActions: ({ children }) => (
          <>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                router.push("/admin");
              }}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid #d1d5db",
                borderRadius: 6,
                background: "#fff",
                color: "#374151",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              ← All Pages
            </a>

            <a
              href={viewPath(slug)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid #d1d5db",
                borderRadius: 6,
                background: "#fff",
                color: "#374151",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View Live ↗
            </a>

            <PreviewButton />

            {children}
          </>
        ),

        header: ({ actions }) => (
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>
              Editing: {slugToTitle(slug)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {actions}
            </div>
          </header>
        ),
      }}
    />
  );
}

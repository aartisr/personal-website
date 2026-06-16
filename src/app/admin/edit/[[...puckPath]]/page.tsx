"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import {
  apiPathFromSlug,
  resolvePageSlugFromSegments,
  slugToTitle,
  viewPathFromSlug,
} from "@/lib/page-slug";
import {
  createDefaultPageData,
  ensureContentIds,
  ensureReusableLayoutBlocks,
} from "@/lib/puck-page-factory";
import { PuckEditorShell } from "@/components/puck/puck-editor-shell";

export default function EditorPage() {
  const params = useParams<{ puckPath?: string[] }>();
  const slug = resolvePageSlugFromSegments(params.puckPath);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await fetch(apiPathFromSlug(slug), { cache: "no-store" });

        if (!response.ok && response.status !== 404) {
          const body = await response.text();
          throw new Error(body || `Failed to load page (HTTP ${response.status})`);
        }

        const payload = response.ok ? ((await response.json()) as Data) : null;
        const pageData = payload || createDefaultPageData(slug);
        const normalizedData = ensureContentIds(ensureReusableLayoutBlocks(pageData));
        setData(normalizedData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load editor data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [slug]);

  const handlePublish = useCallback(
    async (publishData: Data) => {
      const normalizedData = ensureContentIds(ensureReusableLayoutBlocks(publishData));

      const response = await fetch(apiPathFromSlug(slug), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Failed to save page (HTTP ${response.status})`);
      }

      setData(normalizedData);
    },
    [slug]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading editor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-5 py-4 text-red-700">
        <p className="font-semibold">Unable to load editor</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-5 py-4 text-red-700">
        <p className="font-semibold">Unable to load editor</p>
        <p className="mt-1 text-sm">Page data is unavailable.</p>
      </div>
    );
  }

  return (
    <PuckEditorShell
      slug={slug}
      title={slugToTitle(slug)}
      data={data}
      onPublish={handlePublish}
      previewHref={viewPathFromSlug(slug)}
      hint={{
        text: "Header and Footer are managed globally and edited separately.",
        href: "/admin/edit/layout",
        ctaLabel: "Edit layout",
      }}
    />
  );
}

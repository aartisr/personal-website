"use client";

import { useCallback, useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import { PuckEditorShell } from "@/components/puck/puck-editor-shell";
import { createDefaultGlobalLayoutSectionData } from "@/lib/global-layout-defaults";
import { ensureContentIds } from "@/lib/puck-page-factory";

const FOOTER_LAYOUT_API = "/api/layout/footer";

export default function GlobalFooterEditorPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await fetch(FOOTER_LAYOUT_API, { cache: "no-store" });

        if (!response.ok && response.status !== 404) {
          const body = await response.text();
          throw new Error(body || `Failed to load footer layout (HTTP ${response.status})`);
        }

        const payload = response.ok ? ((await response.json()) as Data) : null;
        const layoutData = payload || createDefaultGlobalLayoutSectionData("footer");
        const normalized = ensureContentIds(layoutData);
        setData(normalized);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load footer editor.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handlePublish = useCallback(async (publishData: Data) => {
    const normalized = ensureContentIds(publishData);

    const response = await fetch(FOOTER_LAYOUT_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || `Failed to save footer (HTTP ${response.status})`);
    }

    setData(normalized);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading editor...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-5 py-4 text-red-700">
        <p className="font-semibold">Unable to load footer editor</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-5 py-4 text-red-700">
        <p className="font-semibold">Unable to load footer editor</p>
        <p className="mt-1 text-sm">Footer data is unavailable.</p>
      </div>
    );
  }

  return (
    <PuckEditorShell
      slug="global-footer"
      title="Global Footer"
      data={data}
      onPublish={handlePublish}
      backHref="/admin/edit/layout"
    />
  );
}

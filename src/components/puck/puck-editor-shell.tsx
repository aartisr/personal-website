"use client";

import { Puck, createUsePuck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useCallback, useState } from "react";
import type { Data } from "@puckeditor/core";
import { useRouter } from "next/navigation";
import { puckConfig } from "@/lib/puck-config";

const usePuckSelector = createUsePuck();

type PuckEditorShellProps = {
  slug: string;
  title: string;
  data: Data;
  onPublish: (data: Data) => Promise<void>;
  backHref?: string;
  previewHref?: string;
  hint?: {
    text: string;
    href?: string;
    ctaLabel?: string;
  };
};

function PreviewButton() {
  const dispatch = usePuckSelector((state) => state.dispatch);
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
      className={`px-3 py-1.5 text-[13px] font-semibold border rounded-md cursor-pointer inline-flex items-center gap-1 ${
        previewing
          ? "border-blue-600 bg-blue-50 text-blue-600"
          : "border-gray-300 bg-white text-gray-700"
      }`}
    >
      {previewing ? "✕ Exit Preview" : "▶ Preview"}
    </button>
  );
}

export function PuckEditorShell({
  slug,
  title,
  data,
  onPublish,
  backHref = "/admin",
  previewHref,
  hint,
}: PuckEditorShellProps) {
  const router = useRouter();

  const handlePublish = useCallback(
    async (publishData: Data) => {
      await onPublish(publishData);
    },
    [onPublish]
  );

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
            {hint ? (
              <div className="hidden md:flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">
                <span>{hint.text}</span>
                {hint.href && hint.ctaLabel ? (
                  <a
                    href={hint.href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(hint.href!);
                    }}
                    className="font-semibold text-amber-900 underline underline-offset-2"
                  >
                    {hint.ctaLabel}
                  </a>
                ) : null}
              </div>
            ) : null}

            <a
              href={backHref}
              onClick={(e) => {
                e.preventDefault();
                router.push(backHref);
              }}
              className="px-3 py-1.5 text-[13px] font-semibold border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer no-underline inline-flex items-center gap-1"
            >
              ← All Pages
            </a>

            {previewHref ? (
              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-[13px] font-semibold border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer no-underline inline-flex items-center gap-1"
              >
                View Live ↗
              </a>
            ) : null}

            <PreviewButton />

            {children}
          </>
        ),

        header: ({ actions }) => (
          <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
            <span className="font-semibold text-sm text-gray-700">Editing: {title}</span>
            <div className="flex items-center gap-2">{actions}</div>
          </header>
        ),
      }}
    />
  );
}

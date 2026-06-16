import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { Data } from "@puckeditor/core";
import {
  createDefaultGlobalLayoutData,
  createDefaultGlobalLayoutSectionData,
  extractGlobalLayoutBlocks,
  type GlobalLayoutSection,
} from "@/lib/global-layout-defaults";

const GLOBAL_LAYOUT_PATH = join(
  process.cwd(),
  "content",
  "layout",
  "global-layout.json"
);

function parseData(raw: string): Data | null {
  try {
    return JSON.parse(raw) as Data;
  } catch {
    return null;
  }
}

export function getGlobalLayoutData(): Data {
  if (!existsSync(GLOBAL_LAYOUT_PATH)) {
    return createDefaultGlobalLayoutData();
  }

  const raw = readFileSync(GLOBAL_LAYOUT_PATH, "utf-8");
  const parsed = parseData(raw);

  if (!parsed) {
    return createDefaultGlobalLayoutData();
  }

  const blocks = extractGlobalLayoutBlocks(parsed);

  return {
    root: {
      props: {
        ...(parsed.root?.props ?? {}),
        title: "Global Layout",
      },
    },
    content: [blocks.header, blocks.footer],
  };
}

export function saveGlobalLayoutData(data: Data): void {
  const blocks = extractGlobalLayoutBlocks(data);
  const normalized: Data = {
    root: {
      props: {
        ...(data.root?.props ?? {}),
        title: "Global Layout",
      },
    },
    content: [blocks.header, blocks.footer],
  };

  mkdirSync(dirname(GLOBAL_LAYOUT_PATH), { recursive: true });
  writeFileSync(GLOBAL_LAYOUT_PATH, JSON.stringify(normalized, null, 2));
}

export function getGlobalLayoutSectionData(section: GlobalLayoutSection): Data {
  const layout = getGlobalLayoutData();
  const blocks = extractGlobalLayoutBlocks(layout);

  if (section === "header") {
    return {
      root: { props: { title: "Global Header" } },
      content: [blocks.header],
    };
  }

  return {
    root: { props: { title: "Global Footer" } },
    content: [blocks.footer],
  };
}

export function saveGlobalLayoutSectionData(
  section: GlobalLayoutSection,
  data: Data
): void {
  const incomingContent = Array.isArray(data.content) ? data.content : [];
  const primary = incomingContent[0];

  if (!primary || typeof primary.type !== "string") {
    const fallback = createDefaultGlobalLayoutSectionData(section);
    saveGlobalLayoutSectionData(section, fallback);
    return;
  }

  const currentLayout = getGlobalLayoutData();
  const currentBlocks = extractGlobalLayoutBlocks(currentLayout);
  const expectedType = section === "header" ? "Header" : "Footer";
  const nextBlock = {
    type: expectedType,
    props: (primary.props ?? {}) as Record<string, unknown>,
  };

  const nextLayout: Data = {
    root: currentLayout.root,
    content:
      section === "header"
        ? [nextBlock, currentBlocks.footer]
        : [currentBlocks.header, nextBlock],
  };

  saveGlobalLayoutData(nextLayout);
}

export function applyGlobalLayout(data: Data): Data {
  const layout = getGlobalLayoutData();
  const layoutBlocks = extractGlobalLayoutBlocks(layout);
  const pageContent = Array.isArray(data.content) ? data.content : [];

  const contentWithoutLayout = pageContent.filter(
    (block) => block?.type !== "Header" && block?.type !== "Footer"
  );

  return {
    ...data,
    content: [layoutBlocks.header, ...contentWithoutLayout, layoutBlocks.footer],
  };
}
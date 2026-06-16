import type { Data } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck-config";

type Block = {
  type: string;
  props: Record<string, unknown>;
};

export type GlobalLayoutSection = "header" | "footer";

function sectionToBlockType(section: GlobalLayoutSection): "Header" | "Footer" {
  return section === "header" ? "Header" : "Footer";
}

let idCounter = 0;

function generateId(type: string): string {
  return `${type}-global-${Date.now()}-${++idCounter}`;
}

function defaultPropsFor(type: string): Record<string, unknown> {
  const component = (puckConfig.components as Record<string, unknown>)[type] as
    | { defaultProps?: Record<string, unknown> }
    | undefined;

  return { ...(component?.defaultProps ?? {}) };
}

function ensureBlockId(block: Block): Block {
  const props = block.props;
  const hasId = typeof props.id === "string" && props.id.trim().length > 0;

  return {
    ...block,
    props: {
      ...defaultPropsFor(block.type),
      ...props,
      id: hasId ? props.id : generateId(block.type),
    },
  };
}

export function extractGlobalLayoutBlocks(data: Data): {
  header: Block;
  footer: Block;
} {
  const content = Array.isArray(data.content) ? (data.content as Block[]) : [];

  const header = content.find((block) => block?.type === "Header") ?? {
    type: "Header",
    props: defaultPropsFor("Header"),
  };

  const footer = content.find((block) => block?.type === "Footer") ?? {
    type: "Footer",
    props: defaultPropsFor("Footer"),
  };

  return {
    header: ensureBlockId(header),
    footer: ensureBlockId(footer),
  };
}

export function createDefaultGlobalLayoutData(): Data {
  const blocks = extractGlobalLayoutBlocks({
    root: { props: { title: "Global Layout" } },
    content: [],
  } as Data);

  return {
    root: {
      props: {
        title: "Global Layout",
      },
    },
    content: [blocks.header, blocks.footer],
  };
}

export function createDefaultGlobalLayoutSectionData(
  section: GlobalLayoutSection
): Data {
  const blockType = sectionToBlockType(section);
  const block: Block = {
    type: blockType,
    props: defaultPropsFor(blockType),
  };

  const normalized = ensureBlockId(block);
  const title = section === "header" ? "Global Header" : "Global Footer";

  return {
    root: {
      props: {
        title,
      },
    },
    content: [normalized],
  };
}
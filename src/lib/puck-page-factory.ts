import type { Data } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck-config";
import { normalizePageSlug, slugToTitle } from "@/lib/page-slug";

type PuckContentBlock = {
  type: string;
  props: Record<string, unknown>;
};

let idCounter = 0;

function generateId(type: string): string {
  return `${type}-${Date.now()}-${++idCounter}`;
}

function componentDefaultProps(type: string): Record<string, unknown> {
  const component = (puckConfig.components as Record<string, unknown>)[type] as
    | { defaultProps?: Record<string, unknown> }
    | undefined;

  return { ...(component?.defaultProps ?? {}) };
}

function withBlockId(type: string, props?: Record<string, unknown>): PuckContentBlock {
  return {
    type,
    props: {
      ...componentDefaultProps(type),
      ...(props ?? {}),
      id: typeof props?.id === "string" && props.id ? props.id : generateId(type),
    },
  };
}

export function createDefaultPageData(slug: string): Data {
  const normalizedSlug = normalizePageSlug(slug);
  const title = slugToTitle(normalizedSlug);

  return {
    root: {
      props: {
        title,
      },
    },
    content: [
      withBlockId("Header"),
      withBlockId("HeroSection", {
        heading: title,
        subheading: "",
        description: "Describe this page clearly for readers and search engines.",
      }),
      withBlockId("Footer"),
    ],
  };
}

export function ensureContentIds(data: Data): Data {
  const content = Array.isArray(data.content) ? data.content : [];

  return {
    ...data,
    content: content.map((item) => {
      const type = typeof item.type === "string" ? item.type : "Block";
      const props = (item.props ?? {}) as Record<string, unknown>;

      if (typeof props.id === "string" && props.id.trim()) {
        return item;
      }

      return {
        ...item,
        props: {
          ...props,
          id: generateId(type),
        },
      };
    }),
  };
}

export function ensureReusableLayoutBlocks(data: Data): Data {
  const content = Array.isArray(data.content) ? [...data.content] : [];
  const hasHeader = content.some((item) => item?.type === "Header");
  const hasFooter = content.some((item) => item?.type === "Footer");

  if (!hasHeader) {
    content.unshift(withBlockId("Header"));
  }

  if (!hasFooter) {
    content.push(withBlockId("Footer"));
  }

  return {
    ...data,
    content,
  };
}
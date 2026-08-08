import {
  HOMEPAGE_REQUIRED_BLOCK_TYPES,
  type PuckBlock,
} from "@kindoms/shared-ui/contracts/page-contract";

const MIN_HOMEPAGE_CONTENT_BLOCKS = 3;

export type PageSaveRejection =
  | "empty"
  | "too_small"
  | "missing_required_blocks"
  | "skeleton";

function getContent(data: unknown): PuckBlock[] | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const content = (data as { content?: unknown }).content;
  return Array.isArray(content) ? (content as PuckBlock[]) : null;
}

function hasMeaningfulProps(props: unknown): boolean {
  if (!props || typeof props !== "object") {
    return false;
  }

  return Object.entries(props as Record<string, unknown>)
    .filter(([key]) => key !== "id")
    .some(([, value]) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number" || typeof value === "boolean") return true;
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
    });
}

/**
 * Protects the homepage from accidental destructive saves in the editor.
 * Consumers can bypass this only with an explicit force action.
 */
export function getHomepageSaveRejection(data: unknown): PageSaveRejection | null {
  const content = getContent(data);

  if (!content || content.length === 0) {
    return "empty";
  }

  if (content.length < MIN_HOMEPAGE_CONTENT_BLOCKS) {
    return "too_small";
  }

  const blocksByType = new Map<string, PuckBlock>();
  for (const block of content) {
    if (typeof block.type === "string" && !blocksByType.has(block.type)) {
      blocksByType.set(block.type, block);
    }
  }

  if (HOMEPAGE_REQUIRED_BLOCK_TYPES.some((type) => !blocksByType.has(type))) {
    return "missing_required_blocks";
  }

  const requiredBlocksAreEmpty = HOMEPAGE_REQUIRED_BLOCK_TYPES.every(
    (type) => !hasMeaningfulProps(blocksByType.get(type)?.props)
  );

  return requiredBlocksAreEmpty ? "skeleton" : null;
}

export function pageSaveRejectionMessage(rejection: PageSaveRejection): string {
  const retry = "Retry with ?force=1 if this is intentional.";

  switch (rejection) {
    case "empty":
      return "Refusing to save empty homepage content. " + retry;
    case "too_small":
      return "Refusing to save suspiciously small homepage content. " + retry;
    case "missing_required_blocks":
      return (
        "Refusing to save homepage without required sections (Header, HeroSection, TimelineSection). " +
        retry
      );
    case "skeleton":
      return "Refusing to save homepage skeleton content (id-only blocks). " + retry;
  }
}

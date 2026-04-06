import { NextRequest, NextResponse } from "next/server";
import { getPageData, savePageData, deletePage } from "@/lib/get-page-data";
import {
  HOMEPAGE_REQUIRED_BLOCK_TYPES,
  type PuckBlock,
} from "@kindoms/shared-ui/contracts/page-contract";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

const MIN_HOMEPAGE_CONTENT_BLOCKS = 3;

function isEmptyContentPayload(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return true;
  }

  const content = (data as { content?: unknown }).content;

  if (!Array.isArray(content)) {
    return true;
  }

  return content.length === 0;
}

function isSuspiciouslySmallHomepagePayload(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return true;
  }

  const content = (data as { content?: unknown }).content;

  if (!Array.isArray(content)) {
    return true;
  }

  return content.length < MIN_HOMEPAGE_CONTENT_BLOCKS;
}

function isMissingRequiredHomepageBlocks(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return true;
  }

  const content = (data as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return true;
  }

  const present = new Set(
    (content as PuckBlock[])
      .map((block) => (typeof block.type === "string" ? block.type : ""))
      .filter(Boolean)
  );

  return HOMEPAGE_REQUIRED_BLOCK_TYPES.some((type) => !present.has(type));
}

function hasMeaningfulProps(props: unknown): boolean {
  if (!props || typeof props !== "object") {
    return false;
  }

  const entries = Object.entries(props as Record<string, unknown>).filter(
    ([key]) => key !== "id"
  );

  if (entries.length === 0) {
    return false;
  }

  return entries.some(([, value]) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return true;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (value && typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).length > 0;
    }
    return false;
  });
}

function isHomepageSkeletonPayload(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return true;
  }

  const content = (data as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return true;
  }

  const blockByType = new Map<string, PuckBlock>();
  for (const block of content as PuckBlock[]) {
    if (typeof block.type === "string" && !blockByType.has(block.type)) {
      blockByType.set(block.type, block);
    }
  }

  return HOMEPAGE_REQUIRED_BLOCK_TYPES.every((type) => {
    const block = blockByType.get(type);
    return !block || !hasMeaningfulProps(block.props);
  });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = slug.join("-");
  const data = getPageData(pageSlug);

  if (!data) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = slug.join("-");
  const data = await request.json();

  const forceHomepageSave = new URL(request.url).searchParams.get("force") === "1";
  if (pageSlug === "homepage" && isEmptyContentPayload(data) && !forceHomepageSave) {
    return NextResponse.json(
      {
        error:
          "Refusing to save empty homepage content. Retry with ?force=1 if this is intentional.",
      },
      { status: 400 }
    );
  }

  if (
    pageSlug === "homepage" &&
    isSuspiciouslySmallHomepagePayload(data) &&
    !forceHomepageSave
  ) {
    return NextResponse.json(
      {
        error:
          "Refusing to save suspiciously small homepage content. Retry with ?force=1 if this is intentional.",
      },
      { status: 400 }
    );
  }

  if (
    pageSlug === "homepage" &&
    isMissingRequiredHomepageBlocks(data) &&
    !forceHomepageSave
  ) {
    return NextResponse.json(
      {
        error:
          "Refusing to save homepage without required sections (Header, HeroSection, TimelineSection). Retry with ?force=1 if this is intentional.",
      },
      { status: 400 }
    );
  }

  if (pageSlug === "homepage" && isHomepageSkeletonPayload(data) && !forceHomepageSave) {
    return NextResponse.json(
      {
        error:
          "Refusing to save homepage skeleton content (id-only blocks). Retry with ?force=1 if this is intentional.",
      },
      { status: 400 }
    );
  }

  savePageData(pageSlug, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = slug.join("-");
  const deleted = deletePage(pageSlug);

  if (!deleted) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

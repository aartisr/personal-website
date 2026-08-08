import { NextRequest, NextResponse } from "next/server";
import { pageRepository } from "@/lib/content/page-repository";
import { normalizePageSlug } from "@/lib/page-slug";
import {
  getHomepageSaveRejection,
  pageSaveRejectionMessage,
} from "@/lib/page-integrity";

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = normalizePageSlug(slug.join("/"));
  const data = pageRepository.get(pageSlug);

  if (!data) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = normalizePageSlug(slug.join("/"));
  const data = await request.json();

  const forceHomepageSave = new URL(request.url).searchParams.get("force") === "1";
  const rejection =
    pageSlug === "homepage" && !forceHomepageSave
      ? getHomepageSaveRejection(data)
      : null;

  if (rejection) {
    return NextResponse.json(
      {
        error: pageSaveRejectionMessage(rejection),
      },
      { status: 400 }
    );
  }

  pageRepository.save(pageSlug, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const pageSlug = normalizePageSlug(slug.join("/"));
  const deleted = pageRepository.delete(pageSlug);

  if (!deleted) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

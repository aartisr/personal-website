import { NextRequest, NextResponse } from "next/server";
import {
  getGlobalLayoutSectionData,
  saveGlobalLayoutSectionData,
} from "@/lib/global-layout";
import { ensureContentIds } from "@/lib/puck-page-factory";

export async function GET() {
  return NextResponse.json(getGlobalLayoutSectionData("header"));
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as unknown;

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid header layout payload" }, { status: 400 });
  }

  const normalized = ensureContentIds(payload as any);
  saveGlobalLayoutSectionData("header", normalized);

  return NextResponse.json({ success: true });
}

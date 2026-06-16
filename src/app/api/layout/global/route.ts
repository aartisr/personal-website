import { NextRequest, NextResponse } from "next/server";
import { getGlobalLayoutData, saveGlobalLayoutData } from "@/lib/global-layout";
import { ensureContentIds, ensureReusableLayoutBlocks } from "@/lib/puck-page-factory";

export async function GET() {
  return NextResponse.json(getGlobalLayoutData());
}

export async function PUT(request: NextRequest) {
  const payload = (await request.json()) as unknown;

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid layout payload" }, { status: 400 });
  }

  const normalized = ensureContentIds(ensureReusableLayoutBlocks(payload as any));
  saveGlobalLayoutData(normalized);

  return NextResponse.json({ success: true });
}

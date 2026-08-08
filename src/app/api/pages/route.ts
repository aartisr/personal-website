import { NextResponse } from "next/server";
import { pageRepository } from "@/lib/content/page-repository";

export async function GET() {
  const pages = pageRepository.list();
  return NextResponse.json(pages);
}

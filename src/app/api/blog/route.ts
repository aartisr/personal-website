import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";

export const revalidate = 3600;

export function GET() {
  return NextResponse.json(getAllBlogPosts(), { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}

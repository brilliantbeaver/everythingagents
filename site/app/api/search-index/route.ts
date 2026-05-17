import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";

export function GET() {
  const entries = buildSearchIndex();
  return NextResponse.json({ entries });
}

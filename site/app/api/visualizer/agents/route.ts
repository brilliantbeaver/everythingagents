import { NextResponse } from "next/server";
import { listAgentFiles, saveAgentFile } from "@/lib/visualizer/storage";

export const runtime = "nodejs";

export async function GET() {
  const items = await listAgentFiles();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  let originalName = "uploaded.agent";
  let contents = "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    originalName = file.name || originalName;
    contents = await file.text();
  } else {
    contents = await req.text();
    const headerName = req.headers.get("x-filename");
    if (headerName) originalName = headerName;
  }

  if (!contents.trim()) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (contents.length > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  }

  const stored = await saveAgentFile(originalName, contents);
  return NextResponse.json({ item: stored }, { status: 201 });
}

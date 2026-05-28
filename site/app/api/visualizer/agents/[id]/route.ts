import { NextResponse } from "next/server";
import { deleteAgentFile, readAgentFile, writeAgentFile } from "@/lib/visualizer/storage";
import { parseAgentScript } from "@/lib/visualizer/agentscript/parser";
import { buildGraph } from "@/lib/visualizer/agentscript/graph";

const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2 MB hard cap on .agent edits

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const file = await readAgentFile(id);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ast = parseAgentScript(file.contents, file.fileName);
  const graph = buildGraph(ast);
  return NextResponse.json({
    id,
    fileName: file.fileName,
    source: file.contents,
    ast,
    graph,
  });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let body: { contents?: unknown };
  try {
    body = (await req.json()) as { contents?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const contents = body.contents;
  if (typeof contents !== "string") {
    return NextResponse.json({ error: "contents must be a string" }, { status: 400 });
  }
  if (Buffer.byteLength(contents, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
  const result = await writeAgentFile(id, contents);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, ...result });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await deleteAgentFile(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

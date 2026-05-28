// In-memory storage for uploaded .agent files.
//
// Why in-memory: Vercel's runtime filesystem is ephemeral / read-only outside
// /tmp, so the original disk-backed implementation that wrote to ./uploads
// would not survive in production. An in-memory Map is process-scoped:
// uploads persist for the life of the server process, which is good enough
// for a hosted demo and keeps the Visualizer clickable for first-time
// visitors. Public-facing serverless hosts may rotate workers, so callers
// should treat any upload as transient.
//
// API parity with the original disk implementation is intentional — the
// route handlers are unchanged.

import path from "node:path";

export interface StoredAgent {
  id: string;
  fileName: string;
  bytes: number;
  uploadedAt: string;
}

interface StoredEntry extends StoredAgent {
  contents: string;
}

// Per-process cache. globalThis pin survives Next.js dev hot reloads so the
// in-memory uploads don't vanish on every save.
const GLOBAL_KEY = Symbol.for("ea.visualizer.store.v2");
type GlobalSlot = { store?: Map<string, StoredEntry> };
const slot = globalThis as unknown as Record<symbol, GlobalSlot>;
slot[GLOBAL_KEY] ??= {};
const cache = slot[GLOBAL_KEY];
cache.store ??= new Map<string, StoredEntry>();
const store: Map<string, StoredEntry> = cache.store;

function sanitizeBase(name: string): string {
  const base = path.basename(name).replace(/\.agent$/i, "");
  return base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 96) || "agent";
}

function publicView(e: StoredEntry): StoredAgent {
  return { id: e.id, fileName: e.fileName, bytes: e.bytes, uploadedAt: e.uploadedAt };
}

export async function saveAgentFile(
  originalName: string,
  contents: string,
): Promise<StoredAgent> {
  const ts = new Date();
  const tag = ts.toISOString().replace(/[:.]/g, "-");
  const id = `${sanitizeBase(originalName)}__${tag}`;
  const fileName = `${id}.agent`;
  const entry: StoredEntry = {
    id,
    fileName,
    bytes: Buffer.byteLength(contents, "utf8"),
    uploadedAt: ts.toISOString(),
    contents,
  };
  store.set(id, entry);
  return publicView(entry);
}

export async function listAgentFiles(): Promise<StoredAgent[]> {
  const items = Array.from(store.values()).map(publicView);
  items.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  return items;
}

export async function readAgentFile(
  id: string,
): Promise<{ fileName: string; contents: string } | null> {
  const e = store.get(id);
  if (!e) return null;
  return { fileName: e.fileName, contents: e.contents };
}

export async function writeAgentFile(
  id: string,
  contents: string,
): Promise<{ bytes: number; updatedAt: string } | null> {
  const existing = store.get(id);
  if (!existing) return null;
  const updatedAt = new Date().toISOString();
  const next: StoredEntry = {
    ...existing,
    contents,
    bytes: Buffer.byteLength(contents, "utf8"),
    uploadedAt: updatedAt,
  };
  store.set(id, next);
  return { bytes: next.bytes, updatedAt };
}

export async function deleteAgentFile(id: string): Promise<boolean> {
  return store.delete(id);
}

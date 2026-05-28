// URL token codec for .agent source.
//
// We carry the upload's source through the URL instead of persisting it
// server-side because Vercel's serverless runtime does not give Lambdas a
// shared filesystem or shared memory — any in-memory store would 404 on
// the next request that lands on a cold worker. URL-encoded source is
// stateless: every request reproduces the data without server help, so
// reloading, sharing, or scaling out all behave identically.
//
// Format: base64url(gzip(utf8(source)))
//
// Encoding lives in two worlds:
//   - browser (upload page): uses CompressionStream
//   - node (server render of /visualizer/view): uses node:zlib
// Both produce raw gzip bytes; both decoders accept either side's output.

const URL_SOFT_LIMIT_BYTES = 24 * 1024;

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = (typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64"));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  if (typeof atob === "function") {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function bytesAsBlob(input: Uint8Array): Blob {
  // BlobPart accepts BufferSource which Uint8Array satisfies. The detour
  // through Blob avoids the (current) TS lib quirk where the Response
  // constructor's BodyInit overloads don't pick Uint8Array directly.
  return new Blob([input as BlobPart]);
}

async function gzipCompress(input: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === "function") {
    const cs = new CompressionStream("gzip");
    const stream = bytesAsBlob(input).stream().pipeThrough(cs);
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
  }
  // Server fallback (older Node where CompressionStream isn't available).
  const { gzipSync } = await import("node:zlib");
  return new Uint8Array(gzipSync(Buffer.from(input)));
}

async function gzipDecompress(input: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "function") {
    const ds = new DecompressionStream("gzip");
    const stream = bytesAsBlob(input).stream().pipeThrough(ds);
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
  }
  const { gunzipSync } = await import("node:zlib");
  return new Uint8Array(gunzipSync(Buffer.from(input)));
}

/** Encode a UTF-8 source string to a URL-safe gzipped token. */
export async function encodeSourceToken(source: string): Promise<string> {
  const bytes = new TextEncoder().encode(source);
  const gz = await gzipCompress(bytes);
  return toBase64Url(gz);
}

/** Decode a token back to the original source. Throws TokenError on bad input. */
export async function decodeSourceToken(token: string): Promise<string> {
  if (!token || typeof token !== "string") {
    throw new TokenError("Empty token");
  }
  let gz: Uint8Array;
  try {
    gz = fromBase64Url(token);
  } catch {
    throw new TokenError("Token is not valid base64url");
  }
  let raw: Uint8Array;
  try {
    raw = await gzipDecompress(gz);
  } catch {
    throw new TokenError("Token is not valid gzip");
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(raw);
}

/**
 * Decide whether an encoded token is small enough to live in the URL.
 * Browsers handle ~32 KB in the address bar; we cap conservatively so the
 * full /visualizer/view?src=… URL — including domain, path, and query — fits.
 */
export function tokenFitsInUrl(token: string): boolean {
  return token.length <= URL_SOFT_LIMIT_BYTES;
}

export const URL_SOFT_LIMIT = URL_SOFT_LIMIT_BYTES;

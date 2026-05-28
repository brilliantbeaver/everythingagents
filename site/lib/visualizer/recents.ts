// Client-side "recents" list for the visualizer sidebar.
//
// Without server persistence, the sidebar can't list everyone's uploads —
// and that's fine, because uploads are private to the browser anyway. We
// keep a small per-browser list of the last few files the user opened,
// with the URL token (or a sessionStorage ref for files too big to fit in
// the URL). Clicking an entry navigates to /visualizer/view?src=… or
// /visualizer/view?ref=…, both of which reproduce the file without server
// state.

const STORAGE_KEY = "visualizer:recents:v1";
const MAX_ENTRIES = 25;

export interface Recent {
  /** Stable id used for React keys and dedup; derived from fileName + addedAt. */
  key: string;
  fileName: string;
  /** Display label (config.agent_label || developer_name || basename). */
  label: string;
  /** UTF-8 byte length of the source. */
  sizeBytes: number;
  /** ISO timestamp of when this entry was added. */
  addedAt: string;
  /** URL-safe gzipped source. Present iff small enough for the address bar. */
  src?: string;
  /** sessionStorage key holding the source for files too big for the URL. */
  ref?: string;
}

function read(): Recent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Recent[]) : [];
  } catch {
    return [];
  }
}

function write(items: Recent[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ENTRIES)));
  } catch {
    // Quota exceeded or storage disabled — silently drop.
  }
}

export function listRecents(): Recent[] {
  return read();
}

export function addRecent(entry: Omit<Recent, "key" | "addedAt">): Recent {
  const addedAt = new Date().toISOString();
  const key = `${entry.fileName}__${addedAt}`;
  const next: Recent = { ...entry, key, addedAt };
  const items = [next, ...read().filter((r) => r.fileName !== entry.fileName || r.label !== entry.label)];
  write(items);
  notify();
  return next;
}

export function removeRecent(key: string): void {
  const items = read().filter((r) => r.key !== key);
  write(items);
  notify();
}

export function clearRecents(): void {
  write([]);
  notify();
}

const CHANGE_EVENT = "visualizer:recents:changed";

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

/** Subscribe to recents-list changes. Returns an unsubscribe function. */
export function onRecentsChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(CHANGE_EVENT, cb);
  // Cross-tab updates from localStorage events.
  const storageCb = (e: StorageEvent): void => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", storageCb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", storageCb);
  };
}

/**
 * Build the navigable URL for a Recent. Uses the inline src token when
 * available; otherwise the sessionStorage ref (resolved client-side).
 */
export function recentHref(r: Recent): string {
  if (r.src) return `/visualizer/view?src=${r.src}`;
  if (r.ref) return `/visualizer/view?ref=${encodeURIComponent(r.ref)}`;
  return "/visualizer";
}

const REF_PREFIX = "visualizer:src:";

/** Persist source in sessionStorage and return a short ref id. */
export function putSessionSource(source: string): string {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    sessionStorage.setItem(REF_PREFIX + id, source);
  } catch {
    // Quota — caller should fall through to an error.
  }
  return id;
}

export function getSessionSource(id: string): string | null {
  try {
    return sessionStorage.getItem(REF_PREFIX + id);
  } catch {
    return null;
  }
}

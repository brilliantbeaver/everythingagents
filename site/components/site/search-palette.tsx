"use client";

import { Command } from "cmdk";
import { Search, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/search-index";

type IndexShape = { entries: SearchEntry[] };

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((data: IndexShape) => {
        if (cancelled) return;
        setEntries(data.entries);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, loaded]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
    }
  }, [open]);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        keys: [
          { name: "lessonTitle", weight: 0.4 },
          { name: "keyIdea", weight: 0.25 },
          { name: "headings", weight: 0.2 },
          { name: "body", weight: 0.1 },
          { name: "topicTitle", weight: 0.05 },
        ],
      }),
    [entries],
  );

  const results = useMemo(() => {
    const q = query.trim();
    // Empty input: show no results. The user asked for results to appear
    // only when they've typed something. The empty-state message is
    // rendered in the JSX below, not as a fake result row.
    if (!q) return [];
    return fuse.search(q, { limit: 12 }).map((r) => r.item);
  }, [query, fuse]);

  function go(entry: SearchEntry) {
    onOpenChange(false);
    router.push(entry.href);
  }

  function snippet(entry: SearchEntry): string {
    const q = query.trim().toLowerCase();
    if (!q) return entry.keyIdea;
    const text = entry.body.toLowerCase();
    const idx = text.indexOf(q);
    if (idx < 0) return entry.keyIdea;
    const start = Math.max(0, idx - 40);
    const end = Math.min(entry.body.length, idx + q.length + 80);
    const slice = entry.body.slice(start, end);
    return (start > 0 ? "…" : "") + slice + (end < entry.body.length ? "…" : "");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        <Command label="Search lessons" shouldFilter={false}>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search aria-hidden className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={loaded ? `Search ${entries.length} lessons…` : "Loading lessons…"}
              className="ui-sans h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="ui-sans hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {/* Empty-state messaging, three cases:
                (a) index still loading,
                (b) input empty (encourage the user to type),
                (c) input non-empty but zero matches. */}
            {!loaded && (
              <p className="ui-sans px-3 py-8 text-center text-sm text-muted-foreground">
                Loading lessons…
              </p>
            )}
            {loaded && query.trim() === "" && (
              <p className="ui-sans px-3 py-10 text-center text-sm text-muted-foreground">
                Type to search across all tutorials, lessons, and headings.
              </p>
            )}
            {loaded && query.trim() !== "" && results.length === 0 && (
              <Command.Empty className="ui-sans px-3 py-8 text-center text-sm text-muted-foreground">
                Nothing matches that yet.
              </Command.Empty>
            )}
            {results.map((entry) => (
              <Command.Item
                key={entry.href}
                value={`${entry.lessonTitle} ${entry.keyIdea} ${entry.topicTitle} ${entry.lessonSlug}`}
                onSelect={() => go(entry)}
                className="ui-sans flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-muted/60"
              >
                <span className="ui-sans mt-0.5 inline-block min-w-[28px] shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {entry.kind === "lesson" ? `${entry.lessonNumber}.` : "·"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-base text-foreground">
                    {entry.lessonTitle}
                  </span>
                  <span className="ui-sans block truncate text-xs text-muted-foreground">
                    {entry.kind === "lesson" ? `${entry.topicTitle} · ` : "Topic · "}
                    {snippet(entry)}
                  </span>
                </span>
                <ArrowRight aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

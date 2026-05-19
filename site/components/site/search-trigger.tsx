"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchPalette } from "./search-palette";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || ""));
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!inEditable && e.key === "/") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        aria-haspopup="dialog"
        title="Search the site"
        className="ui-sans group inline-flex h-9 w-full items-center gap-2 rounded-full border border-border bg-muted/50 px-3 text-left text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-72 lg:w-80"
      >
        <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground/70" />
        <span className="flex-1 truncate text-muted-foreground">
          Search lessons, headings, ideas…
        </span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/80 sm:inline-block">
          {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>
      <SearchPalette open={open} onOpenChange={setOpen} />
    </>
  );
}

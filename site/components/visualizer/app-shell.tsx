"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  GitBranch,
  Home,
  Upload,
  FileCode2,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersistedState } from "@/lib/visualizer/use-persisted-state";

interface UploadItem {
  id: string;
  fileName: string;
  uploadedAt: string;
  bytes: number;
}

const DEFAULT_WIDTH = 288;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
// Below this drag width we snap shut to 0 — the handle becomes a "tear-off"
// gesture rather than forcing pixel-perfect alignment with the edge.
const SNAP_THRESHOLD = 140;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [width, setWidth] = usePersistedState<number>("agentscript:sidebarWidth", DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  useEffect(() => {
    const fetchList = () => {
      fetch("/api/visualizer/agents")
        .then((r) => r.json())
        .then((j) => setUploads(j.items ?? []))
        .catch(() => undefined);
    };
    fetchList();
    const handler = () => fetchList();
    window.addEventListener("agents:changed", handler);
    return () => window.removeEventListener("agents:changed", handler);
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startW: width };
      setDragging(true);
    },
    [width],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const ctx = dragRef.current;
      if (!ctx) return;
      const delta = e.clientX - ctx.startX;
      const next = ctx.startW + delta;
      // Live-clamp to MAX; allow visually crossing below MIN so the user feels
      // the snap region. Final commit happens on mouseup.
      if (next >= MAX_WIDTH) setWidth(MAX_WIDTH);
      else if (next < MIN_WIDTH) setWidth(Math.max(0, next));
      else setWidth(next);
    };
    const onUp = () => {
      const ctx = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (!ctx) return;
      // Snap: if we ended below SNAP_THRESHOLD, close fully; otherwise floor
      // at MIN_WIDTH so the panel is never wedged into an unusable sliver.
      setWidth((w) => (w < SNAP_THRESHOLD ? 0 : Math.max(MIN_WIDTH, w)));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    // Disable text selection + force resize cursor during drag.
    const prevUserSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = prevUserSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragging, setWidth]);

  const navItems = [
    { href: "/visualizer", label: "Home", icon: Home },
    { href: "/visualizer/upload", label: "Upload", icon: Upload },
    { href: "/visualizer/docs", label: "Documentation", icon: BookOpen },
  ];

  const isOpen = width > 0;

  return (
    <div className="flex h-full w-full">
      {isOpen && (
        <aside
          style={{ width }}
          className={cn(
            "relative flex shrink-0 flex-col border-r bg-card",
            // Animate width only when not actively dragging; during drag we want
            // 1:1 cursor tracking with no easing lag.
            !dragging && "transition-[width] duration-200 ease-out",
          )}
        >
          {/* The site brand lives in the topbar above; here we only need a
              compact section title for the tool surface plus a collapse
              control. Avoids duplicating the wordmark on the same screen. */}
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
              <GitBranch className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">Agent Visualizer</span>
              <span className="truncate text-[11px] text-muted-foreground">Inspect a .agent file as a graph</span>
            </div>
            <button
              type="button"
              onClick={() => setWidth(0)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <nav className="px-2 py-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "mb-0.5 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-2 px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Uploads
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {uploads.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No uploads yet. Drop a <code className="rounded bg-muted px-1">.agent</code> file in
                the Upload page.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {uploads.map((u) => {
                  const href = `/agents/${u.id}`;
                  const active = pathname === href;
                  const name = u.fileName.replace(/\.agent$/, "");
                  return (
                    <li key={u.id}>
                      <Link
                        href={href}
                        className={cn(
                          "group flex items-start gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                          active
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <FileCode2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(u.uploadedAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            · {(u.bytes / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Drag handle — thin hairline straddling the right edge. Resize
              only; the collapse action lives in the header where it can't
              cover content. Double-click still snaps the panel closed. */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            onMouseDown={onMouseDown}
            onDoubleClick={() => setWidth(0)}
            className={cn(
              "group absolute right-[-3px] top-0 z-20 h-full w-1.5 cursor-col-resize",
              "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border",
              "hover:before:bg-blue-500/60 hover:before:w-0.5",
              dragging && "before:!bg-blue-500 before:!w-0.5",
            )}
          />
        </aside>
      )}

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Reveal toggle — docked at the top-left corner of the canvas
            chrome rather than mid-edge. This mirrors the conventional
            location of sidebar toggles in pro tools (VSCode, Linear,
            Figma) and crucially never overlaps content beneath. Compact
            icon button keeps the affordance discoverable without
            occupying real estate. */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setWidth(DEFAULT_WIDTH)}
            title="Show sidebar"
            aria-label="Show sidebar"
            className={cn(
              "absolute left-3 top-3 z-30",
              "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm",
              "transition-colors duration-150 ease-out",
              "hover:border-blue-500/40 hover:bg-blue-500 hover:text-white",
            )}
          >
            <PanelLeftOpen className="h-4 w-4" strokeWidth={2.25} />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}

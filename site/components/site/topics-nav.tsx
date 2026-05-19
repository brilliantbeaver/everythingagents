"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { topics, topicMinutes } from "@/lib/registry";

export function TopicsNav() {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  const available = topics.filter((t) => t.status === "available");
  const upcoming = topics.filter((t) => t.status === "upcoming");

  function clearTimers() {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleOpen() {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), 80);
  }

  function scheduleClose() {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Link
          ref={triggerRef}
          href="/topics"
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocus={() => {
            clearTimers();
            setOpen(true);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              scheduleClose();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              clearTimers();
              setOpen(true);
              requestAnimationFrame(() => {
                const first = document.querySelector<HTMLAnchorElement>(
                  '[data-topics-menu] a[data-topic-link]',
                );
                first?.focus();
              });
            }
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          aria-haspopup="menu"
          aria-expanded={open}
          className="inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span>Topics</span>
          <ChevronDown
            aria-hidden
            className={`h-3 w-3 transition-transform duration-150 motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          />
        </Link>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          onMouseEnter={clearTimers}
          onMouseLeave={scheduleClose}
          onEscapeKeyDown={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          data-topics-menu
          className="z-50 w-[min(560px,calc(100vw-2rem))] rounded-lg border border-border bg-background shadow-lg ui-sans data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
          role="menu"
          aria-label="Topics"
        >
          <div className="p-2">
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Available
            </div>
            <ul className="space-y-0.5">
              {available.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/topics/${t.slug}`}
                    role="menuitem"
                    data-topic-link
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                  >
                    <span className="font-serif text-[15px] leading-tight text-foreground">
                      {t.shortTitle}
                    </span>
                    <span className="ui-sans ml-2 text-[10px] tabular-nums text-muted-foreground">
                      {t.lessons.length} lessons · {topicMinutes(t)} min
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {t.oneLine}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {upcoming.length > 0 && (
              <>
                <div className="mx-3 my-2 h-px bg-border/70" />
                <div className="px-3 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  In the queue
                </div>
                <ul className="space-y-0.5 pb-2">
                  {upcoming.map((t) => (
                    <li key={t.slug}>
                      <span
                        role="menuitem"
                        aria-disabled="true"
                        className="block cursor-not-allowed rounded-md px-3 py-2 text-sm text-muted-foreground/80"
                      >
                        <span className="font-serif text-[15px] leading-tight">
                          {t.shortTitle}
                        </span>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground/70">
                          {t.oneLine}
                        </p>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mx-3 my-1 h-px bg-border/70" />
            <Link
              href="/topics"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-xs text-accent hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
            >
              Browse all topics →
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

interface RightTOCProps {
  headings: Heading[];
}

export function RightTOC({ headings }: RightTOCProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const targets = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort(
          (a, b) =>
            a.target.getBoundingClientRect().top -
            b.target.getBoundingClientRect().top,
        );
        const top = visible[0];
        if (top.target.id) setActiveSlug(top.target.id);
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="ui-sans">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        On this page
      </p>
      <ol className="mt-2 space-y-1 text-sm">
        {headings.map((h) => {
          const isActive = activeSlug === h.slug;
          return (
            <li key={h.slug} className={h.depth === 3 ? "pl-3" : ""}>
              <a
                href={`#${h.slug}`}
                className={`block rounded px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "border-l-2 border-accent text-foreground font-medium"
                    : "border-l-2 border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

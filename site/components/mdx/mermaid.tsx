"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

export function Mermaid({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const source = typeof children === "string" ? children : String(children);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mod = await import("mermaid");
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "strict",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        });
        const { svg } = await mermaid.render(`m-${id}`, source);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Mermaid render failed");
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [source, resolvedTheme, id]);

  return (
    <figure className="my-6">
      <div
        ref={ref}
        role="img"
        aria-label={caption ?? "Diagram"}
        className="overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-foreground"
      >
        <pre className="ui-sans text-xs text-muted-foreground">{source}</pre>
      </div>
      {caption && (
        <figcaption className="ui-sans mt-2 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
      {error && (
        <p className="ui-sans mt-2 text-xs text-[oklch(55%_0.16_30)]">
          Diagram could not render: {error}. The source is shown above.
        </p>
      )}
    </figure>
  );
}

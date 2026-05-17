import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";

export function KeyIdea({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside
      role="note"
      aria-label={title ?? "Key idea"}
      className="my-6 rounded-md border-l-2 border-accent bg-[oklch(96%_0.04_70_/_1)] dark:bg-[oklch(22%_0.04_70_/_1)] px-4 py-3"
    >
      <div className="ui-sans flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden />
        <span>{title ?? "Key idea"}</span>
      </div>
      <div className="mt-2 text-foreground/90 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

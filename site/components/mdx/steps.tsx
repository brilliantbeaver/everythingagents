import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="my-6 space-y-4 border-l-2 border-border pl-6">
      {children}
    </ol>
  );
}

export function Step({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <li>
      {title && (
        <h3 className="ui-sans text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div className="mt-2 text-foreground/85 [&>p]:my-2 [&>p:first-child]:mt-0">
        {children}
      </div>
    </li>
  );
}

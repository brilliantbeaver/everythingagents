import type { ReactNode } from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

type Variant = "pitfall" | "note" | "warning";

const variants: Record<Variant, { label: string; icon: typeof Info; tint: string; rule: string; ico: string }> = {
  pitfall: {
    label: "Watch out",
    icon: AlertTriangle,
    tint: "bg-[oklch(96%_0.05_60_/_1)] dark:bg-[oklch(24%_0.05_60_/_1)]",
    rule: "border-[oklch(55%_0.14_60)] dark:border-[oklch(75%_0.12_60)]",
    ico: "text-[oklch(55%_0.14_60)] dark:text-[oklch(75%_0.12_60)]",
  },
  note: {
    label: "Worth knowing",
    icon: Info,
    tint: "bg-muted/50",
    rule: "border-muted-foreground/40",
    ico: "text-muted-foreground",
  },
  warning: {
    label: "Heads up",
    icon: AlertCircle,
    tint: "bg-[oklch(96%_0.05_30_/_1)] dark:bg-[oklch(24%_0.05_30_/_1)]",
    rule: "border-[oklch(55%_0.16_30)] dark:border-[oklch(75%_0.13_30)]",
    ico: "text-[oklch(55%_0.16_30)] dark:text-[oklch(75%_0.13_30)]",
  },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const v = variants[type];
  const Icon = v.icon;
  return (
    <aside
      role="note"
      aria-label={title ?? v.label}
      className={`my-6 rounded-md border-l-2 ${v.rule} ${v.tint} px-4 py-3`}
    >
      <div className="ui-sans flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
        <Icon className={`h-3.5 w-3.5 ${v.ico}`} aria-hidden />
        <span className={v.ico}>{title ?? v.label}</span>
      </div>
      <div className="mt-2 text-foreground/90 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

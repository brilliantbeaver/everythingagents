"use client";

import { Eye, EyeOff, PanelRightClose, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphEdgeKind, GraphNodeKind } from "@/lib/visualizer/agentscript/graph";

export type ToggleKind = "subagent" | "action" | "variable";

const KIND_COLOR: Record<GraphNodeKind, string> = {
  start: "hsl(346 84% 60%)",
  subagent: "hsl(217 91% 60%)",
  action: "hsl(258 90% 66%)",
  variable: "hsl(38 92% 50%)",
  system: "hsl(160 84% 39%)",
};

const EDGE_COLOR: Record<GraphEdgeKind, string> = {
  transition: "hsl(217 85% 55%)",
  invokes: "hsl(258 70% 60%)",
  reads: "hsl(35 90% 48%)",
  writes: "hsl(35 90% 48%)",
  owns: "hsl(215 18% 55%)",
};

interface LayerRow {
  kind: ToggleKind | "start";
  label: string;
  count: number;
  toggleable: boolean;
  visible: boolean;
}

interface Props {
  agentLabel: string;
  counts: Record<GraphNodeKind, number>;
  visible: Record<ToggleKind, boolean>;
  onToggle: (k: ToggleKind) => void;
  onSolo: (k: ToggleKind) => void;
  /** Currently soloed kind, or null if none. */
  soloed: ToggleKind | null;
  hoveredEdge: GraphEdgeKind | null;
  onHoverEdge: (k: GraphEdgeKind | null) => void;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
}

/**
 * A single docked inspector panel that combines what used to be three floating
 * cards (Agent stats, Show toggles, Edge legend). Each "layer" row shows the
 * color, name, count, and a visibility switch — a single place to read AND
 * control the canvas. Edge rows are hover-interactive to focus a single
 * relationship type without hiding the rest.
 */
export function CanvasInspector({
  agentLabel,
  counts,
  visible,
  onToggle,
  onSolo,
  soloed,
  hoveredEdge,
  onHoverEdge,
  collapsed,
  onCollapsedChange,
}: Props) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => onCollapsedChange(false)}
        title="Show inspector"
        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/95 text-muted-foreground shadow-[0_2px_8px_rgba(15,23,42,0.06),0_12px_28px_-16px_rgba(15,23,42,0.18)] backdrop-blur transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <Layers className="h-4 w-4" />
      </button>
    );
  }
  const layers: LayerRow[] = [
    { kind: "start", label: "Start", count: counts.start + counts.system, toggleable: false, visible: true },
    { kind: "subagent", label: "Subagents", count: counts.subagent, toggleable: true, visible: visible.subagent },
    { kind: "action", label: "Actions", count: counts.action, toggleable: true, visible: visible.action },
    { kind: "variable", label: "Variables", count: counts.variable, toggleable: true, visible: visible.variable },
  ];

  const edges: { kind: GraphEdgeKind; label: string }[] = [
    { kind: "transition", label: "transition" },
    { kind: "invokes", label: "invokes" },
    { kind: "reads", label: "reads / writes" },
    { kind: "owns", label: "owns" },
  ];

  return (
    <aside className="pointer-events-auto flex w-[280px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_24px_48px_-24px_rgba(15,23,42,0.18)] backdrop-blur">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Agent
          </div>
          <div className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-foreground">
            {agentLabel}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onCollapsedChange(true)}
          title="Hide inspector"
          aria-label="Hide inspector"
          className="-mr-1 -mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Layers */}
      <div className="px-2 pb-2 pt-3">
        <SectionLabel>Layers</SectionLabel>
        <div className="mt-1 flex flex-col">
          {layers.map((row) => {
            const color = KIND_COLOR[row.kind === "start" ? "start" : row.kind];
            const isSoloed = row.toggleable && soloed === row.kind;
            const isDimmed = soloed !== null && row.toggleable && soloed !== row.kind;

            return (
              <div
                key={row.kind}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors",
                  "hover:bg-muted/60",
                  isSoloed && "bg-muted/70",
                  isDimmed && "opacity-50",
                )}
              >
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background"
                  style={{ background: color }}
                />
                <button
                  type="button"
                  onClick={() => row.toggleable && onSolo(row.kind as ToggleKind)}
                  disabled={!row.toggleable}
                  title={row.toggleable ? `Click to solo ${row.label}` : row.label}
                  className={cn(
                    "min-w-0 flex-1 truncate text-left font-medium text-foreground",
                    row.toggleable && "cursor-pointer",
                  )}
                >
                  {row.label}
                </button>
                <span className="tabular-nums text-[11px] text-muted-foreground">
                  {row.count}
                </span>
                {row.toggleable ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={row.visible}
                    aria-label={`Toggle ${row.label}`}
                    onClick={() => onToggle(row.kind as ToggleKind)}
                    className={cn(
                      "ml-1 inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors",
                      "hover:bg-muted hover:text-foreground",
                      !row.visible && "text-muted-foreground/50",
                    )}
                  >
                    {row.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                ) : (
                  <span className="ml-1 inline-block h-5 w-5" />
                )}
              </div>
            );
          })}
        </div>
        {soloed && (
          <button
            type="button"
            onClick={() => onSolo(soloed)}
            className="mt-1 w-full rounded-md px-2 py-1 text-left text-[11px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            Clear solo
          </button>
        )}
      </div>

      <div className="mx-2 border-t" />

      {/* Edges */}
      <div className="px-2 pb-3 pt-2">
        <SectionLabel>Edges</SectionLabel>
        <div className="mt-1 flex flex-col">
          {edges.map((e) => {
            const isHovered = hoveredEdge === e.kind;
            const isDimmed = hoveredEdge !== null && hoveredEdge !== e.kind;
            return (
              <button
                key={e.kind}
                type="button"
                onMouseEnter={() => onHoverEdge(e.kind)}
                onMouseLeave={() => onHoverEdge(null)}
                onFocus={() => onHoverEdge(e.kind)}
                onBlur={() => onHoverEdge(null)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1 text-left text-[12px] transition-colors",
                  "hover:bg-muted/60",
                  isHovered && "bg-muted/70",
                  isDimmed && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "h-[3px] w-6 shrink-0 rounded-full transition-all",
                    isHovered && "h-[4px]",
                  )}
                  style={{ background: EDGE_COLOR[e.kind] }}
                />
                <span className="text-foreground">{e.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 px-2 text-[10px] leading-relaxed text-muted-foreground">
          Hover an edge type to focus it on the canvas.
        </p>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </div>
  );
}

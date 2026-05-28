"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Variable, Workflow, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SatelliteNodeData extends Record<string, unknown> {
  kind: "action" | "variable";
  label: string;
  sublabel?: string;
  shared?: boolean;
  payload?: Record<string, unknown>;
}

/**
 * Compact "satellite" chip used for Actions and Variables. These orbit a
 * subagent and are smaller, lighter-weight than the primary subagent cards
 * so they read as auxiliary detail rather than peers.
 */
export function SatelliteNode({ data, selected }: NodeProps) {
  const d = data as SatelliteNodeData;
  const isAction = d.kind === "action";
  const Icon = isAction ? Workflow : Variable;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-full border bg-[#FAF7F2] px-2.5 py-1.5 text-card-foreground shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition dark:bg-[hsl(220_22%_16%)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_2px_6px_rgba(15,23,42,0.1)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.5)]",
        isAction
          ? "border-violet-200/80 dark:border-violet-500/30"
          : "border-amber-200/80 dark:border-amber-500/30",
        selected && "ring-2 ring-blue-500/60 ring-offset-1 ring-offset-background",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="agent-handle-satellite"
        isConnectable={false}
      />
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          isAction
            ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300"
            : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
        )}
      >
        <Icon className="h-3 w-3" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-tight text-foreground">
        {d.label}
      </span>
      {d.shared && (
        <span
          title="Referenced by multiple subagents"
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70"
        >
          <Share2 className="h-3 w-3" />
        </span>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="agent-handle-satellite"
        isConnectable={false}
      />
    </div>
  );
}

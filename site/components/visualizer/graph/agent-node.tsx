"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Hash, Play, Variable, Workflow, GitBranch, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphNodeKind } from "@/lib/visualizer/agentscript/graph";

export interface AgentNodeData extends Record<string, unknown> {
  kind: GraphNodeKind;
  label: string;
  sublabel?: string;
  payload?: Record<string, unknown>;
  /** Number of action chips this subagent owns (set by composeLayout). */
  actionCount?: number;
  /** Number of variable chips this subagent owns. */
  variableCount?: number;
  /** Whether to show the ambient count badge (true when chips are hidden). */
  showActionBadge?: boolean;
  showVariableBadge?: boolean;
}

const ICON: Record<GraphNodeKind, LucideIcon> = {
  start: Play,
  subagent: Hash,
  action: Workflow,
  variable: Variable,
  system: GitBranch,
};

// Soft-tinted icon-tile palette matching the Agentforce builder reference:
// pale fill + slightly darker icon stroke, paired with the same accent on
// the card's left edge to give each kind a subtle identity without losing
// the white card look.
const TILE: Record<GraphNodeKind, string> = {
  start: "bg-white text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:ring-emerald-600",
  subagent: "bg-white text-sky-700 ring-1 ring-sky-300 dark:bg-sky-900/60 dark:text-sky-200 dark:ring-sky-600",
  action: "bg-white text-violet-700 ring-1 ring-violet-300 dark:bg-violet-900/60 dark:text-violet-200 dark:ring-violet-600",
  variable: "bg-white text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:ring-amber-600",
  system: "bg-white text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:ring-amber-600",
};

// Solid accent stripe color for the left edge of the card. Matches the TILE
// hue family but at full saturation so it reads against the white surface.
const ACCENT: Record<GraphNodeKind, string> = {
  start: "bg-emerald-500",
  subagent: "bg-blue-500",
  action: "bg-violet-500",
  variable: "bg-amber-500",
  system: "bg-amber-500",
};

// Whole-card kind-tinted background. Far more colorful than a neutral
// surface — the card itself becomes the identity signal, not just the
// icon tile and stripe. Light mode uses 100/200-level fills (~92-95%
// lightness) so 19px text retains AAA contrast; dark mode uses 700/800
// fills with subtle saturation pull-back to keep the surface from
// vibrating against bright text.
const CARD: Record<GraphNodeKind, string> = {
  start:
    "bg-emerald-100/80 border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-700",
  subagent:
    "bg-sky-100/80 border-sky-300 dark:bg-sky-950/60 dark:border-sky-700",
  action:
    "bg-violet-100/80 border-violet-300 dark:bg-violet-950/60 dark:border-violet-700",
  variable:
    "bg-amber-100/80 border-amber-300 dark:bg-amber-950/60 dark:border-amber-700",
  system:
    "bg-amber-100/80 border-amber-300 dark:bg-amber-950/60 dark:border-amber-700",
};

const SUBLABEL: Record<GraphNodeKind, string> = {
  start: "Agent",
  subagent: "Subagent",
  action: "Action",
  variable: "Variable",
  system: "Agent",
};

export function AgentNode({ data, selected }: NodeProps) {
  const d = data as AgentNodeData;
  const Icon = ICON[d.kind];
  const sublabel = d.sublabel || SUBLABEL[d.kind];

  return (
    <div
      className={cn(
        // Pure white card on the (now-darker) canvas reads as a lifted
        // surface. 1.5px slate border at higher contrast + a layered shadow
        // (1px crisp top + diffuse drop) gives the card real depth without
        // looking like a 2012 web button.
        // Warm off-white card (#FAF7F2) reads as a parchment-like figure
        // against the cool slate canvas — the hue shift gives a clearer
        // figure/ground separation than pure white at the same lightness.
        // Vibrant kind-tinted card — the whole surface carries the kind's
        // identity, far more colorful than a neutral lift. Heavy 2px
        // colored border + layered drop shadow keeps the card distinctly
        // separated from canvas in both modes.
        "group relative flex h-full min-w-[340px] max-w-[420px] items-center gap-4 overflow-hidden rounded-2xl border-2 px-7 py-5 text-card-foreground shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_4px_8px_rgba(15,23,42,0.08),0_24px_48px_-16px_rgba(15,23,42,0.35)] transition dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_4px_10px_rgba(0,0,0,0.5),0_24px_48px_-14px_rgba(0,0,0,0.7)]",
        CARD[d.kind],
        "hover:shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_6px_12px_rgba(15,23,42,0.1),0_32px_56px_-14px_rgba(15,23,42,0.4)]",
        selected && "ring-2 ring-blue-500/60 ring-offset-2 ring-offset-background",
      )}
    >
      {/* Accent stripe — kind-tinted left edge to give each card identity
          without dyeing the entire surface. Sits inside the rounded clip so
          the corner radius is preserved. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-1",
          ACCENT[d.kind],
        )}
      />
      {/* Four hidden anchor points so floating edges can attach to whichever
          side is closest to the other endpoint. Visible handles would clutter
          the card; the floating-edge component computes geometry from node
          centers and renders the path itself. */}
      <Handle type="target" position={Position.Top} id="t" className="agent-handle-floating" isConnectable={false} />
      <Handle type="source" position={Position.Top} id="ts" className="agent-handle-floating" isConnectable={false} />
      <Handle type="target" position={Position.Right} id="r" className="agent-handle-floating" isConnectable={false} />
      <Handle type="source" position={Position.Right} id="rs" className="agent-handle-floating" isConnectable={false} />
      <Handle type="target" position={Position.Left} id="l" className="agent-handle-floating" isConnectable={false} />
      <Handle type="source" position={Position.Left} id="ls" className="agent-handle-floating" isConnectable={false} />

      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          TILE[d.kind],
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={2.25} />
      </div>

      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-[19px] font-semibold tracking-tight text-foreground">
          {d.label}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-slate-600 dark:text-slate-300">
          <span className="truncate">{sublabel}</span>
          <CountBadges data={d} />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="b" className="agent-handle-floating" isConnectable={false} />
      <Handle type="target" position={Position.Bottom} id="bt" className="agent-handle-floating" isConnectable={false} />
    </div>
  );
}

function CountBadges({ data }: { data: AgentNodeData }) {
  const actions = data.actionCount ?? 0;
  const variables = data.variableCount ?? 0;
  // Always show counts when the corresponding chips are hidden — that's the
  // whole point of the ambient badge. When chips are visible, suppress the
  // badge to avoid double-encoding.
  const showActions = data.showActionBadge && actions > 0;
  const showVariables = data.showVariableBadge && variables > 0;
  if (!showActions && !showVariables) return null;
  return (
    <span className="ml-auto flex shrink-0 items-center gap-1 text-[10px] font-medium tabular-nums">
      {showActions && (
        <span
          title={`${actions} action${actions === 1 ? "" : "s"}`}
          className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-1.5 py-0.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
        >
          <Workflow className="h-2.5 w-2.5" strokeWidth={2.5} />
          {actions}
        </span>
      )}
      {showVariables && (
        <span
          title={`${variables} variable${variables === 1 ? "" : "s"}`}
          className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
        >
          <Variable className="h-2.5 w-2.5" strokeWidth={2.5} />
          {variables}
        </span>
      )}
    </span>
  );
}

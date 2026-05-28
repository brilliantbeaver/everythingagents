// Layout pipeline.
//
// Two-phase design so toggling auxiliary kinds doesn't reflow the conversation
// skeleton:
//
//   1. layoutSkeleton(model) — runs ELK on Start + Subagent nodes wired by
//      transition/owns(sub→sub) edges. Returns a stable position map keyed by
//      node id. Subagent positions are paramount and never change after this.
//
//   2. composeLayout({ skeleton, model, visibility }) — pure post-pass that
//      places auxiliary Action and Variable chips deterministically beside
//      their owning subagent (no ELK), and emits short tether edges only.
//      Long-range cross-subagent reference edges are NOT emitted by default;
//      they are surfaced via the hover-focus mechanism in the canvas.
//
// Why not let ELK lay out everything? Because adding auxiliary nodes always
// nudges the skeleton even when the user just wants more detail. Stability of
// the conversational topology beats global optimality of the auxiliary slot.

import ELK, { type ElkNode, type LayoutOptions } from "elkjs/lib/elk.bundled.js";
import { type Edge, type Node } from "@xyflow/react";
import type { GraphEdge, GraphModel, GraphNode, GraphNodeKind } from "./graph";

const elk = new ELK();

export const NODE_DIMS: Record<GraphNodeKind, { width: number; height: number }> = {
  start: { width: 420, height: 136 },
  subagent: { width: 380, height: 124 },
  action: { width: 168, height: 40 },
  variable: { width: 152, height: 36 },
  system: { width: 260, height: 70 },
};

// Top-down layered layout tuned for symmetry around the vertical axis and
// minimal edge crossings:
// - BRANDES_KOEPF placement with BALANCED alignment centers each layer's
//   nodes under their parent set (more visually symmetric than NETWORK_SIMPLEX
//   for tree-shaped graphs).
// - LAYER_SWEEP crossing minimization is the gold standard for reducing
//   criss-crossing in layered graphs.
// - semiInteractive is OFF so ELK can freely reorder for fewer crossings
//   each time the model changes.
const SKELETON_LAYOUT: LayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  // Generous spacing in BOTH axes — lateral room reduces label overlap and
  // gives back-edges enough gutter to route between siblings instead of
  // diagonally over them. Vertical room makes the layer structure obvious.
  // Spacing tightened to compensate for the larger card footprint. Card
  // width: 360 → 380 (+20), so nodeNode 100 → 80. Card height: 112 → 124
  // (+12), so nodeNodeBetweenLayers 144 → 132. Net center-to-center
  // distances stay roughly constant — bigger cards without longer lines.
  "elk.layered.spacing.nodeNodeBetweenLayers": "132",
  "elk.spacing.nodeNode": "80",
  // NETWORK_SIMPLEX horizontal placement minimizes total edge length, which
  // pulls strongly-connected leaf clusters (e.g., Customer Verification +
  // Price Match) toward the column of their predecessor (Order Returns)
  // instead of centering them globally. BRANDES_KOEPF would tree-center each
  // node under its parent set, which on this graph plants Price Match in the
  // middle and forces lines to cross Layer 2 nodes. SIMPLEX makes the side
  // cluster sit next to its anchor, sweeping the long-haul Selector→PM line
  // around the right edge of the diagram.
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  // Bias the optimizer toward making single-edge chains (CV→PM, Selector→PM)
  // as straight as possible. With SIMPLEX this further encourages the side
  // cluster to align horizontally with its anchor instead of dropping into
  // the center.
  "elk.layered.nodePlacement.favorStraightEdges": "true",
  // Layering: MIN_WIDTH balances node count per layer so a single back-edge
  // doesn't push one node into an isolated deeper row (e.g., Price Match
  // alone below Customer Verification). Combined with NIKOLOV node promotion
  // this also shortens long edges by lifting nodes up when there's room.
  "elk.layered.layering.strategy": "MIN_WIDTH",
  // -1 = no cap. Without this, MIN_WIDTH targets a narrow ideal width and
  // overflow nodes get pushed into a deeper row. Raising the cap lets a
  // wide layer (e.g., 6 children of the Selector) absorb the two siblings
  // (Price Match, Customer Verification) instead of demoting them.
  "elk.layered.layering.minWidth.upperBoundOnWidth": "-1",
  // Higher scaling factor = more dummy nodes are tolerated when promoting
  // a node up a layer. With back-edges in the graph this is what actually
  // unlocks promotion, since each back-edge introduces dummies that count
  // against the budget.
  "elk.layered.layering.minWidth.upperLayerEstimationScalingFactor": "4",
  "elk.layered.layering.nodePromotion.strategy": "NIKOLOV",
  "elk.layered.layering.nodePromotion.maxIterations": "0",
  // DEPTH_FIRST cycle breaking is biased toward shallow back-edge depth —
  // when there's a 2-cycle like Order Returns ↔ Customer Verification, it
  // tends to keep both nodes on the same layer rather than stacking one
  // below the other (which is what GREEDY does on this graph).
  "elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.edgeRouting": "SPLINES",
  "elk.layered.mergeEdges": "true",
  "elk.layered.thoroughness": "10",
  // Post-compaction LEFT pulls all nodes leftward where free space exists,
  // which paradoxically helps the side cluster: the main Layer 2 row
  // compacts left, freeing the right side for CV+PM to sit cleanly without
  // overlapping the long-haul Selector→PM curve.
  "elk.layered.compaction.postCompaction.strategy": "LEFT",
};

export interface SkeletonLayout {
  /** id -> {x, y} for skeleton nodes (start + subagents). */
  positions: Map<string, { x: number; y: number }>;
}

/**
 * Layout only the conversational skeleton. Aux kinds are excluded from ELK
 * input so their visibility never disturbs subagent placement.
 */
export async function layoutSkeleton(model: GraphModel): Promise<SkeletonLayout> {
  const skeletonNodeIds = new Set(
    model.nodes.filter((n) => n.kind === "start" || n.kind === "subagent").map((n) => n.id),
  );

  const elkNodes: ElkNode[] = model.nodes
    .filter((n) => skeletonNodeIds.has(n.id))
    .map((n) => ({
      id: n.id,
      width: NODE_DIMS[n.kind].width,
      height: NODE_DIMS[n.kind].height,
    }));

  const elkEdges = model.edges
    .filter((e) => skeletonNodeIds.has(e.source) && skeletonNodeIds.has(e.target))
    .filter((e) => e.kind === "transition")
    .map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] }));

  const elkGraph: ElkNode = {
    id: "root",
    layoutOptions: SKELETON_LAYOUT,
    children: elkNodes,
    edges: elkEdges,
  };

  const laid = await elk.layout(elkGraph);
  const positions = new Map<string, { x: number; y: number }>();
  for (const c of laid.children ?? []) {
    positions.set(c.id, { x: c.x ?? 0, y: c.y ?? 0 });
  }
  return { positions };
}

export interface ComposeOptions {
  showActions: boolean;
  showVariables: boolean;
}

export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * For each subagent, return the ids of action and variable nodes that orbit
 * it. An action orbits the subagent that invokes/owns it. A variable orbits
 * the first subagent (in graph traversal order) whose actions read or write
 * it; if none of its actions are anchored, it orbits the system root and is
 * placed near the topmost skeleton node.
 */
function computeOwnership(model: GraphModel): {
  actionOwner: Map<string, string>;
  variableOwner: Map<string, string>;
  /** ids of variables and actions referenced by *more than one* subagent */
  shared: Set<string>;
} {
  const actionOwner = new Map<string, string>();
  const variableOwner = new Map<string, string>();
  const actionRefs = new Map<string, Set<string>>(); // actionId -> set of subagent ids
  const variableRefs = new Map<string, Set<string>>();

  const addRef = (m: Map<string, Set<string>>, k: string, v: string) => {
    let s = m.get(k);
    if (!s) {
      s = new Set();
      m.set(k, s);
    }
    s.add(v);
  };

  // Build action -> subagent links from invokes + owns edges.
  for (const e of model.edges) {
    if (e.kind === "invokes" || e.kind === "owns") {
      const src = model.nodes.find((n) => n.id === e.source);
      const tgt = model.nodes.find((n) => n.id === e.target);
      if (!src || !tgt) continue;
      if (src.kind === "subagent" && tgt.kind === "action") {
        addRef(actionRefs, tgt.id, src.id);
        if (!actionOwner.has(tgt.id)) actionOwner.set(tgt.id, src.id);
      }
      if (src.kind === "start" && tgt.kind === "action") {
        addRef(actionRefs, tgt.id, src.id);
        if (!actionOwner.has(tgt.id)) actionOwner.set(tgt.id, src.id);
      }
    }
  }

  // Build variable -> subagent links transitively through actions.
  // reads: variable -> action; writes: action -> variable.
  for (const e of model.edges) {
    let actionId: string | null = null;
    let variableId: string | null = null;
    if (e.kind === "reads") {
      variableId = e.source;
      actionId = e.target;
    } else if (e.kind === "writes") {
      actionId = e.source;
      variableId = e.target;
    }
    if (!actionId || !variableId) continue;
    const subagentId = actionOwner.get(actionId);
    if (!subagentId) continue;
    addRef(variableRefs, variableId, subagentId);
    if (!variableOwner.has(variableId)) variableOwner.set(variableId, subagentId);
  }

  const shared = new Set<string>();
  for (const [id, refs] of actionRefs) if (refs.size > 1) shared.add(id);
  for (const [id, refs] of variableRefs) if (refs.size > 1) shared.add(id);

  return { actionOwner, variableOwner, shared };
}

interface SatelliteSlot {
  /** Local offset from the subagent's top-left, in canvas px. */
  dx: number;
  dy: number;
}

/**
 * Deterministic grid-pack of satellite chips beside the subagent card.
 * Layout strategy: a 2-column grid placed below the subagent, with actions
 * occupying the top rows (tighter to the parent) and variables in lower
 * rows. Slots are stable relative to the parent so toggling Actions doesn't
 * shuffle Variables, and vice versa.
 */
function packSatellites(
  parentWidth: number,
  parentHeight: number,
  count: number,
  startRow: number,
  chipWidth: number,
  chipHeight: number,
): SatelliteSlot[] {
  const COLS = 2;
  const COL_GAP = 8;
  const ROW_GAP = 6;
  const TOP_GAP = 14; // gap below the parent before the first row of chips
  const slots: SatelliteSlot[] = [];

  // Center the chip grid horizontally under the parent card.
  const totalWidth = COLS * chipWidth + (COLS - 1) * COL_GAP;
  const startX = (parentWidth - totalWidth) / 2;

  for (let i = 0; i < count; i++) {
    const col = i % COLS;
    const row = startRow + Math.floor(i / COLS);
    const dx = startX + col * (chipWidth + COL_GAP);
    const dy = parentHeight + TOP_GAP + row * (chipHeight + ROW_GAP);
    slots.push({ dx, dy });
  }
  return slots;
}

/**
 * Compose the final React Flow node + edge arrays from a stable skeleton and
 * a visibility config. Pure / synchronous.
 */
export function composeLayout(
  model: GraphModel,
  skeleton: SkeletonLayout,
  options: ComposeOptions,
): LayoutResult {
  const { showActions, showVariables } = options;
  const { actionOwner, variableOwner, shared } = computeOwnership(model);

  const skeletonIds = new Set<string>(
    model.nodes.filter((n) => n.kind === "start" || n.kind === "subagent").map((n) => n.id),
  );

  // 1) Skeleton nodes — placed by ELK.
  const counts = countsByOwner(model, actionOwner, variableOwner, showActions, showVariables);
  const nodes: Node[] = [];
  for (const n of model.nodes) {
    if (!skeletonIds.has(n.id)) continue;
    const pos = skeleton.positions.get(n.id) ?? { x: 0, y: 0 };
    const c = counts.get(n.id) ?? { actions: 0, variables: 0 };
    nodes.push({
      id: n.id,
      type: "agentNode",
      position: pos,
      data: {
        kind: n.kind,
        label: n.label,
        sublabel: n.sublabel,
        payload: n.data,
        // Always-on ambient counts so users see resource intensity even when
        // the auxiliary chips are hidden.
        actionCount: countActionsOwnedBy(model, actionOwner, n.id),
        variableCount: countVariablesOwnedBy(model, variableOwner, n.id),
        showActionBadge: !showActions,
        showVariableBadge: !showVariables,
      },
      width: NODE_DIMS[n.kind].width,
      height: NODE_DIMS[n.kind].height,
    });
    void c; // counts is reused below for slot allocation; keep for clarity
  }

  // 2) Satellite chips — placed relative to their owning subagent.
  const tetherEdges: Edge[] = [];
  if (showActions || showVariables) {
    // Group action and variable nodes by owner.
    const actionsByOwner = new Map<string, GraphNode[]>();
    const variablesByOwner = new Map<string, GraphNode[]>();
    for (const n of model.nodes) {
      if (n.kind === "action" && showActions) {
        const owner = actionOwner.get(n.id);
        if (!owner) continue;
        const arr = actionsByOwner.get(owner) ?? [];
        arr.push(n);
        actionsByOwner.set(owner, arr);
      }
      if (n.kind === "variable" && showVariables) {
        const owner = variableOwner.get(n.id);
        if (!owner) continue;
        const arr = variablesByOwner.get(owner) ?? [];
        arr.push(n);
        variablesByOwner.set(owner, arr);
      }
    }

    // Stable order — by label — so chip slot assignment doesn't wobble.
    const byLabel = (a: GraphNode, b: GraphNode) => a.label.localeCompare(b.label);
    for (const arr of actionsByOwner.values()) arr.sort(byLabel);
    for (const arr of variablesByOwner.values()) arr.sort(byLabel);

    for (const [ownerId, ownerPos] of skeleton.positions) {
      const owner = model.nodes.find((n) => n.id === ownerId);
      if (!owner) continue;
      const parentDims = NODE_DIMS[owner.kind];
      const parentW = parentDims.width;
      const parentH = parentDims.height;

      const ownActions = actionsByOwner.get(ownerId) ?? [];
      const ownVariables = variablesByOwner.get(ownerId) ?? [];

      const actionDims = NODE_DIMS.action;
      const variableDims = NODE_DIMS.variable;

      const actionSlots = packSatellites(
        parentW,
        parentH,
        ownActions.length,
        0,
        actionDims.width,
        actionDims.height,
      );
      // Variables placed below the action grid.
      const actionRows = Math.ceil(ownActions.length / 2);
      const variableSlots = packSatellites(
        parentW,
        parentH + actionRows * (actionDims.height + 6) + (actionRows > 0 ? 8 : 0),
        ownVariables.length,
        0,
        variableDims.width,
        variableDims.height,
      );

      for (let i = 0; i < ownActions.length; i++) {
        const a = ownActions[i];
        const slot = actionSlots[i];
        nodes.push({
          id: a.id,
          type: "satelliteNode",
          position: { x: ownerPos.x + slot.dx, y: ownerPos.y + slot.dy },
          data: {
            kind: "action",
            label: a.label,
            sublabel: a.sublabel,
            payload: a.data,
            shared: shared.has(a.id),
          },
          width: actionDims.width,
          height: actionDims.height,
        });
        tetherEdges.push({
          id: `tether:${ownerId}->${a.id}`,
          source: ownerId,
          target: a.id,
          type: "straight",
          data: { kind: "tether-action", weight: 0.4 },
          style: tetherStyle("action"),
        });
      }

      for (let i = 0; i < ownVariables.length; i++) {
        const v = ownVariables[i];
        const slot = variableSlots[i];
        nodes.push({
          id: v.id,
          type: "satelliteNode",
          position: { x: ownerPos.x + slot.dx, y: ownerPos.y + slot.dy },
          data: {
            kind: "variable",
            label: v.label,
            sublabel: v.sublabel,
            payload: v.data,
            shared: shared.has(v.id),
          },
          width: variableDims.width,
          height: variableDims.height,
        });
        tetherEdges.push({
          id: `tether:${ownerId}->${v.id}`,
          source: ownerId,
          target: v.id,
          type: "straight",
          data: { kind: "tether-variable", weight: 0.3 },
          style: tetherStyle("variable"),
        });
      }
    }
  }

  // 3) Skeleton edges — transitions between subagents. Bidirectional pairs
  // (A→B and B→A) collapse to a single edge with arrows on both ends so the
  // canvas reads "two-way handoff" instead of two parallel curves competing
  // for the same gutter.
  const visibleNodeIds = new Set(nodes.map((n) => n.id));
  const transitions = model.edges.filter(
    (e) =>
      e.kind === "transition" &&
      visibleNodeIds.has(e.source) &&
      visibleNodeIds.has(e.target),
  );
  const skeletonEdges = mergeBidirectionalTransitions(transitions);

  return { nodes, edges: [...skeletonEdges, ...tetherEdges] };
}

/**
 * Detect (A→B, B→A) pairs and emit a single React Flow edge with markers on
 * both ends. Self-loops are passed through unchanged. Edge ids of merged
 * pairs are joined with `+` so downstream code (hover, focus) can still match
 * on either original id by substring if needed.
 */
function mergeBidirectionalTransitions(edges: GraphEdge[]): Edge[] {
  const consumed = new Set<string>();
  const byPair = new Map<string, GraphEdge>();
  const pairKey = (a: string, b: string) => `${a}__${b}`;
  for (const e of edges) byPair.set(pairKey(e.source, e.target), e);

  const out: Edge[] = [];
  for (const e of edges) {
    if (consumed.has(e.id)) continue;
    if (e.source === e.target) {
      out.push(toReactFlowEdge(e));
      consumed.add(e.id);
      continue;
    }
    const reverse = byPair.get(pairKey(e.target, e.source));
    if (reverse && !consumed.has(reverse.id)) {
      out.push(toBidirectionalEdge(e, reverse));
      consumed.add(e.id);
      consumed.add(reverse.id);
      continue;
    }
    out.push(toReactFlowEdge(e));
    consumed.add(e.id);
  }
  return out;
}

function toBidirectionalEdge(forward: GraphEdge, reverse: GraphEdge): Edge {
  const primary = (forward.primary ?? false) || (reverse.primary ?? false);
  const labels = [forward.label, reverse.label].filter(
    (l): l is string => Boolean(l) && l !== undefined,
  );
  const merged =
    labels.length === 0
      ? undefined
      : labels.length === 1
        ? labels[0]
        : labels[0] === labels[1]
          ? labels[0]
          : `${labels[0]} ↔ ${labels[1]}`;
  return {
    id: `${forward.id}+${reverse.id}`,
    source: forward.source,
    target: forward.target,
    type: "floating",
    label: merged,
    data: { kind: "transition", weight: (forward.weight ?? 1) + (reverse.weight ?? 1), bidirectional: true, primary },
    style: edgeStyle("transition", primary),
    // Custom kite marker (defined in <EdgeMarkers />). Same shape & size on
    // every edge — kind differentiation lives in stroke color + dash.
    markerStart: markerForKind("transition"),
    markerEnd: markerForKind("transition"),
    labelStyle: { fontSize: 11, fill: "hsl(215 25% 27%)", fontWeight: 500 },
    labelBgStyle: { fill: "white", fillOpacity: 0.96 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  };
}

function countActionsOwnedBy(model: GraphModel, actionOwner: Map<string, string>, ownerId: string): number {
  let n = 0;
  for (const node of model.nodes) {
    if (node.kind === "action" && actionOwner.get(node.id) === ownerId) n++;
  }
  return n;
}

function countVariablesOwnedBy(model: GraphModel, variableOwner: Map<string, string>, ownerId: string): number {
  let n = 0;
  for (const node of model.nodes) {
    if (node.kind === "variable" && variableOwner.get(node.id) === ownerId) n++;
  }
  return n;
}

function countsByOwner(
  model: GraphModel,
  actionOwner: Map<string, string>,
  variableOwner: Map<string, string>,
  _showActions: boolean,
  _showVariables: boolean,
): Map<string, { actions: number; variables: number }> {
  const out = new Map<string, { actions: number; variables: number }>();
  for (const n of model.nodes) {
    if (n.kind === "subagent" || n.kind === "start") {
      out.set(n.id, { actions: 0, variables: 0 });
    }
  }
  for (const [aid, owner] of actionOwner) {
    void aid;
    const e = out.get(owner);
    if (e) e.actions++;
  }
  for (const [vid, owner] of variableOwner) {
    void vid;
    const e = out.get(owner);
    if (e) e.variables++;
  }
  return out;
}

function toReactFlowEdge(e: GraphEdge): Edge {
  const primary = e.primary ?? false;
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: "floating",
    label: e.label,
    data: { kind: e.kind, weight: e.weight ?? 1, primary },
    style: edgeStyle(e.kind, primary),
    markerEnd: markerForKind(e.kind),
    labelStyle: { fontSize: 11, fill: "hsl(215 25% 27%)", fontWeight: 500 },
    labelBgStyle: { fill: "white", fillOpacity: 0.96 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  };
}

// Saturated, readable edge palette. Primary transitions (from the start
// subagent) get the deepest blue and heaviest stroke so they read as the
// agent's top-level routing decisions; secondary transitions inside
// sub-flows get a lighter, thinner treatment so the eye doesn't conflate
// them with primary routes.
// Uniform stroke width for all edges. Kind differentiation is encoded
// purely through (1) hue and (2) dash pattern. Avoiding width variation
// keeps the graph reading as one consistent system rather than a
// hierarchy of "important" vs "less important" lines.
const EDGE_STROKE_WIDTH = 2;

function edgeColor(kind: string, _primary = false): string {
  switch (kind) {
    case "transition":
      return "hsl(217 80% 52%)";
    case "invokes":
      return "hsl(258 70% 60%)";
    case "writes":
    case "reads":
      return "hsl(35 90% 48%)";
    case "owns":
      return "hsl(215 18% 55%)";
    default:
      return "hsl(215 18% 50%)";
  }
}

function edgeStyle(kind: string, _primary = false): React.CSSProperties {
  const stroke = edgeColor(kind);
  const base = { stroke, strokeWidth: EDGE_STROKE_WIDTH } as React.CSSProperties;
  switch (kind) {
    case "transition":
      // Solid — the conversational flow; the most important channel reads
      // as the "default" line type, no decoration.
      return base;
    case "invokes":
      // Long dash — subagent reaches into an action.
      return { ...base, strokeDasharray: "8 4" };
    case "writes":
      // Medium dash — data flowing out of an action into a variable.
      return { ...base, strokeDasharray: "5 3" };
    case "reads":
      // Dotted — data flowing in from a variable. Lighter rhythm than
      // writes so the asymmetry between read/write is visible at a glance.
      return { ...base, strokeDasharray: "2 3" };
    case "owns":
      // Sparse dot pattern — structural ownership is the quietest channel.
      return { ...base, strokeDasharray: "1 4" };
    default:
      return base;
  }
}

// Map an edge kind to its custom marker URL. All markers share the same
// physical size; only color varies, in lockstep with the edge stroke.
function markerForKind(kind: string): string {
  switch (kind) {
    case "transition":
      return "url(#arrow-transition)";
    case "invokes":
      return "url(#arrow-invokes)";
    case "reads":
    case "writes":
      return "url(#arrow-data)";
    default:
      return "url(#arrow-neutral)";
  }
}

/**
 * Tether style for satellite chips. Deliberately faint so the eye reads the
 * chip as belonging to its parent without the tether becoming visual noise.
 */
function tetherStyle(kind: "action" | "variable"): React.CSSProperties {
  if (kind === "action") {
    return { stroke: "hsl(258 50% 75%)", strokeWidth: 1, strokeDasharray: "3 3", opacity: 0.7 };
  }
  return { stroke: "hsl(35 60% 65%)", strokeWidth: 1, strokeDasharray: "3 3", opacity: 0.7 };
}

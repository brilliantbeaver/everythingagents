"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { useMemo } from "react";

/**
 * Floating edge — picks the closest side of each endpoint so back-edges
 * (target above source, or arbitrary cross-graph references) take the
 * shortest perimeter-to-perimeter path instead of always exiting Bottom and
 * entering Top.
 *
 * Why this matters in our layered graph:
 *   - Forward transitions (parent → child) read naturally as Bottom→Top.
 *   - Back-edges (e.g., Customer Verification → Order Returns above it) used
 *     to wrap around the entire card, crossing every layer between them.
 *     Routing them out the *side* nearest the target removes those crossings.
 *   - Lateral transitions between siblings now cleanly hop Right→Left or
 *     Left→Right rather than diving down and looping back up.
 *
 * Self-loops are handled separately — for source===target we draw a small
 * curl out the right side and back in.
 */
export function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  markerStart,
  style,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  data,
}: EdgeProps) {
  const showLabel = (data as { showLabel?: boolean } | undefined)?.showLabel ?? false;
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const path = useMemo(() => {
    if (!sourceNode || !targetNode) return null;

    // Self-loop: draw a small curl out the right side and back into the top.
    if (source === target) {
      const w = sourceNode.measured?.width ?? 240;
      const h = sourceNode.measured?.height ?? 80;
      const x = sourceNode.internals.positionAbsolute.x;
      const y = sourceNode.internals.positionAbsolute.y;
      const rightX = x + w;
      const midY = y + h / 2;
      const topX = x + w * 0.75;
      const topY = y;
      const r = 36;
      const d = `M ${rightX},${midY} C ${rightX + r},${midY} ${topX + r},${topY - r} ${topX},${topY}`;
      return { d, labelX: rightX + r * 0.6, labelY: midY - r * 0.6 };
    }

    const sBox = nodeBox(sourceNode);
    const tBox = nodeBox(targetNode);
    // Forward layered edges (target sits below source): default to Bottom→Top
    // so arrows land on the top-middle of children — the canonical reading
    // for tree/DAG layouts.
    //
    // Exception: SKIP-LAYER forward edges (e.g., Subagent Selector → Price
    // Match where Off Topic sits between them). A straight Bottom→Top bezier
    // would visually pierce the intermediate node, making the long-haul
    // connection invisible. We instead route these out the *side* of the
    // source nearest the target so the curve sweeps around the middle row.
    //
    // Detection: vertical span big enough to imply at least one layer is
    // skipped (more than ~one full layer height of empty space between the
    // boxes), AND the target is laterally offset enough that side-routing
    // doesn't introduce its own crossings. Both conditions together; either
    // alone would over-trigger and break the canonical adjacent-layer look.
    const verticalGap = tBox.y - (sBox.y + sBox.h);
    const lateralOffset = Math.abs(tBox.cx - sBox.cx);
    const SKIP_LAYER_GAP = 220; // ~one full layer hop (height ~112 + spacing 144 - margin)
    const SKIP_LAYER_LATERAL = sBox.w * 0.5;
    const isForward = tBox.y >= sBox.y + sBox.h * 0.4;
    const isSkipLayer =
      isForward && verticalGap > SKIP_LAYER_GAP && lateralOffset > SKIP_LAYER_LATERAL;

    let sPos: Position;
    let sx: number;
    let sy: number;
    let tPos: Position;
    let tx: number;
    let ty: number;

    if (isSkipLayer) {
      // Source exits the side that points toward the target; target enters
      // its top-middle so the arrowhead still reads as a forward landing.
      const goRight = tBox.cx > sBox.cx;
      sPos = goRight ? Position.Right : Position.Left;
      sx = goRight ? sBox.x + sBox.w : sBox.x;
      sy = sBox.cy;
      tPos = Position.Top;
      tx = tBox.cx;
      ty = tBox.y;
    } else if (isForward) {
      [sPos, sx, sy] = [Position.Bottom, sBox.cx, sBox.y + sBox.h];
      [tPos, tx, ty] = [Position.Top, tBox.cx, tBox.y];
    } else {
      [sPos, sx, sy] = closestSide(sBox, tBox);
      [tPos, tx, ty] = closestSide(tBox, sBox);
    }

    const [d, labelX, labelY] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: sPos,
      targetX: tx,
      targetY: ty,
      targetPosition: tPos,
    });

    return { d, labelX, labelY };
  }, [sourceNode, targetNode, source, target]);

  if (!path) return null;

  return (
    <>
      <BaseEdge id={id} path={path.d} markerEnd={markerEnd} markerStart={markerStart} style={style} />
      {showLabel && label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${path.labelX}px, ${path.labelY}px)`,
              pointerEvents: "all",
              fontSize: 11,
              fontWeight: 500,
              color: "hsl(215 25% 27%)",
              background: "white",
              padding: `${(labelBgPadding?.[1] ?? 3)}px ${(labelBgPadding?.[0] ?? 6)}px`,
              borderRadius: labelBgBorderRadius ?? 4,
              opacity: 0.96,
              boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
              zIndex: 10,
              ...(labelStyle ?? {}),
              ...(labelBgStyle ? { background: (labelBgStyle as { fill?: string }).fill ?? "white" } : {}),
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function nodeBox(n: NonNullable<ReturnType<typeof useInternalNode>>): Box {
  const w = n.measured?.width ?? 240;
  const h = n.measured?.height ?? 80;
  const x = n.internals.positionAbsolute.x;
  const y = n.internals.positionAbsolute.y;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/**
 * Pick the side of `from` whose midpoint is closest to `to`'s center.
 * Returns the React Flow Position enum and the absolute x/y where the edge
 * should attach.
 *
 * Prefers vertical sides when the dominant axis of the connection is vertical
 * (top↔bottom) and horizontal sides when it's horizontal — this gives clean
 * Bottom→Top for forward layered edges and Right→Left (or Left→Right) for
 * lateral / back-edges.
 */
function closestSide(from: Box, to: Box): [Position, number, number] {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const horizontal = Math.abs(dx) > Math.abs(dy);

  if (horizontal) {
    if (dx > 0) return [Position.Right, from.x + from.w, from.cy];
    return [Position.Left, from.x, from.cy];
  }
  if (dy > 0) return [Position.Bottom, from.cx, from.y + from.h];
  return [Position.Top, from.cx, from.y];
}

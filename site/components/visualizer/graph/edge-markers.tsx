"use client";

// Custom SVG arrowhead markers, registered once at the canvas root and
// referenced by id from edges. We define our own instead of using React
// Flow's MarkerType.Arrow / ArrowClosed because:
//   - MarkerType.Arrow is two thin strokes — feels brittle, especially
//     after we bumped edge stroke weight.
//   - MarkerType.ArrowClosed is a wide flat-base triangle that visibly
//     warps when paths enter at steep angles.
// The "kite" shape below has a sharp tip and a gently concave tail so the
// silhouette stays balanced at every rotation, while the filled body
// gives it the visual weight of a modern UI arrow.

interface MarkerSpec {
  id: string;
  color: string;
}

// Single shared path definition. viewBox is 10×10; tip at (10, 5).
// The kite outline: base notches inward at x=2 to give the arrow a
// "swept back" feel rather than a flat triangular base.
const KITE_PATH = "M 0 0 L 10 5 L 0 10 L 2 5 Z";

// All markers share the same physical size so every arrowhead in the graph
// reads at identical visual weight. Differentiation between edge kinds is
// carried by stroke color + dash pattern on the path itself.
const MARKER_SIZE = 10;

const MARKERS: MarkerSpec[] = [
  { id: "arrow-transition", color: "hsl(217 80% 52%)" },
  { id: "arrow-invokes", color: "hsl(258 70% 60%)" },
  { id: "arrow-data", color: "hsl(35 90% 48%)" },
  { id: "arrow-neutral", color: "hsl(215 18% 50%)" },
];

export function EdgeMarkers() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        {MARKERS.map((m) => (
          <marker
            key={m.id}
            id={m.id}
            viewBox="0 0 10 10"
            // refX at the tip so the arrow's point sits exactly on the
            // edge endpoint instead of overshooting into the node.
            refX="10"
            refY="5"
            markerWidth={MARKER_SIZE}
            markerHeight={MARKER_SIZE}
            // userSpaceOnUse keeps the marker size independent of the
            // edge's stroke-width so heavier lines don't inflate it.
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path
              d={KITE_PATH}
              fill={m.color}
              stroke={m.color}
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

export const ARROW_TRANSITION = "url(#arrow-transition)";
export const ARROW_INVOKES = "url(#arrow-invokes)";
export const ARROW_DATA = "url(#arrow-data)";
export const ARROW_NEUTRAL = "url(#arrow-neutral)";

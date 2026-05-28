"use client";

import { MiniMap } from "@xyflow/react";
import { GripVertical, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersistedState } from "@/lib/visualizer/use-persisted-state";

interface Props {
  nodeColor: (node: { data: { kind: string } }) => string;
  onClose: () => void;
}

interface Pos {
  /** Distance from the right edge of the canvas, in px. */
  right: number;
  /** Distance from the bottom edge of the canvas, in px. */
  bottom: number;
}

const DEFAULT_POS: Pos = { right: 16, bottom: 16 };
const MAP_WIDTH = 200;
const MAP_HEIGHT = 140;

/**
 * Minimap rendered in a draggable floating panel. Sits inside the ReactFlow
 * subtree so it has access to viewport state; uses a fixed-size container
 * with React Flow's MiniMap inside. Position persists across sessions.
 *
 * Why a wrapper instead of MiniMap's `position` prop: React Flow only
 * supports the four corner positions, but we want the user to drag it out
 * of the way of nodes that happen to live in their preferred corner.
 */
export function FloatingMinimap({ nodeColor, onClose }: Props) {
  const [pos, setPos] = usePersistedState<Pos>("agentscript:minimapPos", DEFAULT_POS);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startRight: number;
    startBottom: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startRight: pos.right,
        startBottom: pos.bottom,
      };
      setDragging(true);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      // Translate screen-delta into right/bottom deltas (right = -dx, bottom = -dy).
      setPos({
        right: Math.max(0, dragRef.current.startRight - dx),
        bottom: Math.max(0, dragRef.current.startBottom - dy),
      });
    },
    [setPos],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setDragging(false);
  }, []);

  // Clamp into viewport when window shrinks so the panel doesn't drift offscreen.
  useEffect(() => {
    const clamp = () => {
      setPos((prev) => {
        const maxRight = Math.max(0, window.innerWidth - MAP_WIDTH - 8);
        const maxBottom = Math.max(0, window.innerHeight - MAP_HEIGHT - 8);
        if (prev.right <= maxRight && prev.bottom <= maxBottom) return prev;
        return {
          right: Math.min(prev.right, maxRight),
          bottom: Math.min(prev.bottom, maxBottom),
        };
      });
    };
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [setPos]);

  return (
    <div
      className="pointer-events-auto absolute z-20 select-none overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_18px_36px_-20px_rgba(15,23,42,0.25)] backdrop-blur"
      style={{
        right: `${pos.right}px`,
        bottom: `${pos.bottom}px`,
        width: `${MAP_WIDTH}px`,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={
          "flex items-center justify-between gap-1 border-b px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground " +
          (dragging ? "cursor-grabbing" : "cursor-grab")
        }
      >
        <div className="flex items-center gap-1">
          <GripVertical className="h-3 w-3" />
          Minimap
        </div>
        <button
          type="button"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          title="Hide minimap"
          aria-label="Hide minimap"
          className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div
        style={{ height: `${MAP_HEIGHT}px`, width: `${MAP_WIDTH}px` }}
        className="floating-minimap-host relative"
      >
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => nodeColor(n as unknown as { data: { kind: string } })}
          maskColor="rgba(15,23,42,0.05)"
        />
      </div>
    </div>
  );
}

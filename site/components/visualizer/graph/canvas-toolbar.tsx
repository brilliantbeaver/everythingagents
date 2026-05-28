"use client";

import { Layers, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  inspectorVisible: boolean;
  onToggleInspector: () => void;
  minimapVisible: boolean;
  onToggleMinimap: () => void;
}

/**
 * Compact floating control cluster. Lives at the top-right corner of the
 * canvas. Single source of truth for canvas chrome toggles so users don't
 * hunt for them.
 */
export function CanvasToolbar({
  inspectorVisible,
  onToggleInspector,
  minimapVisible,
  onToggleMinimap,
}: Props) {
  return (
    <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-card/95 p-1 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_12px_28px_-16px_rgba(15,23,42,0.18)] backdrop-blur">
      <ToolbarButton
        active={inspectorVisible}
        onClick={onToggleInspector}
        title={inspectorVisible ? "Hide inspector" : "Show inspector"}
      >
        <Layers className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={minimapVisible}
        onClick={onToggleMinimap}
        title={minimapVisible ? "Hide minimap" : "Show minimap"}
      >
        <MapIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

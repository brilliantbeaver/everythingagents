"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type EdgeMouseHandler,
  type Node,
  type NodeMouseHandler,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useState } from "react";

import { AgentNode, type AgentNodeData } from "./agent-node";
import { SatelliteNode, type SatelliteNodeData } from "./satellite-node";
import { FloatingEdge } from "./floating-edge";
import { EdgeMarkers } from "./edge-markers";
import { DetailPanel } from "./detail-panel";
import { CanvasInspector, type ToggleKind } from "./canvas-inspector";
import { CanvasToolbar } from "./canvas-toolbar";
import { FloatingMinimap } from "./floating-minimap";
import {
  composeLayout,
  layoutSkeleton,
  type SkeletonLayout,
} from "@/lib/visualizer/agentscript/layout";
import { usePersistedState } from "@/lib/visualizer/use-persisted-state";
import type { GraphEdgeKind, GraphModel, GraphNodeKind } from "@/lib/visualizer/agentscript/graph";

const nodeTypes = { agentNode: AgentNode, satelliteNode: SatelliteNode };
const edgeTypes = { floating: FloatingEdge };

const MINIMAP_COLORS: Record<GraphNodeKind, string> = {
  start: "hsl(346 84% 60%)",
  subagent: "hsl(217 91% 60%)",
  action: "hsl(258 90% 66%)",
  variable: "hsl(38 92% 50%)",
  system: "hsl(160 84% 39%)",
};

interface Props {
  model: GraphModel;
  agentLabel: string;
}

export function GraphCanvas({ model, agentLabel }: Props) {
  return (
    <ReactFlowProvider>
      <Inner model={model} agentLabel={agentLabel} />
    </ReactFlowProvider>
  );
}

type SelectedNode =
  | { id: string; kind: "primary"; data: AgentNodeData }
  | { id: string; kind: "satellite"; data: SatelliteNodeData };

function Inner({ model, agentLabel }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selected, setSelected] = useState<SelectedNode | null>(null);
  // Default: only the conversational skeleton (Start + Subagents). Actions
  // and Variables are auxiliary detail that the user can opt into without
  // disturbing subagent placement.
  const [visibleKinds, setVisibleKinds] = useState<Record<ToggleKind, boolean>>({
    subagent: true,
    action: false,
    variable: false,
  });
  const [soloed, setSoloed] = useState<ToggleKind | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdgeKind | null>(null);
  const [hoverActive, setHoverActive] = useState<
    { kind: "edge"; id: string } | { kind: "node"; id: string } | null
  >(null);
  const [inspectorCollapsed, setInspectorCollapsed] = usePersistedState<boolean>(
    "agentscript:inspectorCollapsed",
    false,
  );
  const [minimapVisible, setMinimapVisible] = usePersistedState<boolean>(
    "agentscript:minimapVisible",
    true,
  );
  const [skeleton, setSkeleton] = useState<SkeletonLayout | null>(null);
  const { fitView } = useReactFlow();

  // Solo focuses one auxiliary layer. Subagents always stay visible — they
  // are the skeleton; hiding them would orphan the soloed chips.
  const effectiveVisible: Record<ToggleKind, boolean> = useMemo(() => {
    if (soloed) {
      return {
        subagent: true,
        action: soloed === "action",
        variable: soloed === "variable",
      };
    }
    return visibleKinds;
  }, [visibleKinds, soloed]);

  // Phase 1: layout the skeleton ONCE per model. This produces stable
  // subagent/start positions that never shift when satellites toggle.
  useEffect(() => {
    let cancelled = false;
    layoutSkeleton(model).then((res) => {
      if (!cancelled) setSkeleton(res);
    });
    return () => {
      cancelled = true;
    };
  }, [model]);

  // Phase 2: compose nodes + edges from the skeleton + visibility flags.
  // Synchronous and cheap; runs on every toggle without disturbing positions.
  useEffect(() => {
    if (!skeleton) return;
    const showSubagent = effectiveVisible.subagent;
    if (!showSubagent) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const result = composeLayout(model, skeleton, {
      showActions: effectiveVisible.action,
      showVariables: effectiveVisible.variable,
    });
    setNodes(result.nodes);
    setEdges(result.edges);
  }, [model, skeleton, effectiveVisible, setNodes, setEdges]);

  // Fit view ONLY when the model identity changes (new agent file). Toggling
  // satellites should reveal them in place rather than zooming around.
  useEffect(() => {
    if (!skeleton) return;
    requestAnimationFrame(() => fitView({ padding: 0.2, duration: 400 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, skeleton]);

  // Edge focus: dim edges that don't match hoveredEdge.
  // Hover reveal: edges connected to hovered node, or the hovered edge itself,
  // get their label revealed and a slight emphasis bump (overrides kind dim).
  const displayedEdges: Edge[] = useMemo(() => {
    const matches = (k: GraphEdgeKind): boolean => {
      if (!hoveredEdge) return true;
      if (hoveredEdge === "reads" || hoveredEdge === "writes") {
        return k === "reads" || k === "writes";
      }
      return k === hoveredEdge;
    };
    return edges.map((e) => {
      const reveal =
        hoverActive !== null &&
        ((hoverActive.kind === "edge" && hoverActive.id === e.id) ||
          (hoverActive.kind === "node" &&
            (e.source === hoverActive.id || e.target === hoverActive.id)));

      const baseStrokeWidth =
        typeof e.style?.strokeWidth === "number" ? e.style.strokeWidth : 1.4;

      let opacity: number | undefined;
      let strokeWidth = baseStrokeWidth;

      if (hoveredEdge) {
        const k = (e.data as { kind?: GraphEdgeKind } | undefined)?.kind;
        const focused = k ? matches(k) : false;
        opacity = focused ? 1 : 0.15;
        strokeWidth = baseStrokeWidth + (focused ? 0.6 : 0);
      }

      if (reveal) {
        opacity = 1;
        strokeWidth = strokeWidth + 0.5;
      }

      const nextStyle =
        hoveredEdge || reveal
          ? { ...(e.style ?? {}), ...(opacity !== undefined ? { opacity } : {}), strokeWidth }
          : e.style;

      return {
        ...e,
        data: { ...(e.data ?? {}), showLabel: reveal },
        style: nextStyle,
      };
    });
  }, [edges, hoveredEdge, hoverActive]);

  const onEdgeMouseEnter: EdgeMouseHandler = (_e, edge) =>
    setHoverActive({ kind: "edge", id: edge.id });
  const onEdgeMouseLeave: EdgeMouseHandler = () => setHoverActive(null);
  const onNodeMouseEnter: NodeMouseHandler = (_e, node) =>
    setHoverActive({ kind: "node", id: node.id });
  const onNodeMouseLeave: NodeMouseHandler = () => setHoverActive(null);

  const onNodeClick: NodeMouseHandler = (_e, node) => {
    if (node.type === "satelliteNode") {
      setSelected({
        id: node.id,
        kind: "satellite",
        data: node.data as SatelliteNodeData,
      });
    } else {
      setSelected({
        id: node.id,
        kind: "primary",
        data: node.data as AgentNodeData,
      });
    }
  };

  const counts = useMemo(() => {
    const c: Record<GraphNodeKind, number> = {
      start: 0,
      subagent: 0,
      action: 0,
      variable: 0,
      system: 0,
    };
    for (const n of model.nodes) c[n.kind]++;
    return c;
  }, [model.nodes]);

  const toggle = (k: ToggleKind): void => {
    setVisibleKinds((prev) => ({ ...prev, [k]: !prev[k] }));
    setSoloed(null);
  };

  const solo = (k: ToggleKind): void => {
    setSoloed((prev) => (prev === k ? null : k));
  };

  // The DetailPanel only knows AgentNodeData shape; both primary and satellite
  // share the same minimum fields (kind/label/sublabel/payload), so we narrow.
  const selectedForPanel = selected
    ? {
        id: selected.id,
        data: {
          kind: selected.data.kind as GraphNodeKind,
          label: selected.data.label,
          sublabel: selected.data.sublabel,
          payload: selected.data.payload,
        } as AgentNodeData,
      }
    : null;

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute right-4 top-4 z-10">
        <CanvasInspector
          agentLabel={agentLabel}
          counts={counts}
          visible={visibleKinds}
          onToggle={toggle}
          onSolo={solo}
          soloed={soloed}
          hoveredEdge={hoveredEdge}
          onHoverEdge={setHoveredEdge}
          collapsed={inspectorCollapsed}
          onCollapsedChange={setInspectorCollapsed}
        />
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-20">
        <CanvasToolbar
          inspectorVisible={!inspectorCollapsed}
          onToggleInspector={() => setInspectorCollapsed(!inspectorCollapsed)}
          minimapVisible={minimapVisible}
          onToggleMinimap={() => setMinimapVisible(!minimapVisible)}
        />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={displayedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onPaneClick={() => setSelected(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "floating" }}
        minZoom={0.1}
        maxZoom={2.5}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <EdgeMarkers />
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.1} />
        <Controls position="bottom-left" showInteractive={false} />
        {minimapVisible && (
          <FloatingMinimap
            nodeColor={(n) => {
              const data = n.data as { kind: GraphNodeKind | "action" | "variable" };
              return MINIMAP_COLORS[data.kind as GraphNodeKind] ?? "hsl(215 16% 70%)";
            }}
            onClose={() => setMinimapVisible(false)}
          />
        )}
      </ReactFlow>

      <DetailPanel node={selectedForPanel} onClose={() => setSelected(null)} />
    </div>
  );
}

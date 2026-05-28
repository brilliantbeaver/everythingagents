// Convert a parsed AgentScriptAST into a node/edge graph model suitable for
// rendering with React Flow. Layout (x/y) is applied separately on the client
// using ELK, which lets the same graph render on different screen sizes.

import type { AgentScriptAST, SubagentDef } from "./types";

export type GraphNodeKind = "start" | "subagent" | "action" | "variable" | "system";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  sublabel?: string;
  /** Arbitrary extra payload surfaced in the detail drawer */
  data: Record<string, unknown>;
}

export type GraphEdgeKind = "transition" | "invokes" | "reads" | "writes" | "owns";

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: GraphEdgeKind;
  label?: string;
  /** Strength controls the visual weight of the edge */
  weight?: number;
  /**
   * Marks transitions originating from the start subagent (the top-level
   * router). These are the agent's primary routing decisions and render
   * with stronger visual weight than secondary transitions inside deeper
   * sub-flows — without this distinction, a Selector→OR edge looks
   * identical to an OR↔CV cycle and the eye groups them as one flow.
   */
  primary?: boolean;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SYSTEM_ID = "__system__";

export function buildGraph(ast: AgentScriptAST): GraphModel {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const usedEdgeIds = new Set<string>();

  const push = (n: GraphNode): void => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    nodes.push(n);
  };

  // Generate a globally-unique edge id. If a candidate collides with an id we
  // already emitted (which can happen for legitimately identical references —
  // e.g., two subagents that both pass `orderNumber = @variables.order_number`
  // to the same action), we append a numeric suffix until it's unique.
  const uniqueEdgeId = (base: string): string => {
    if (!usedEdgeIds.has(base)) {
      usedEdgeIds.add(base);
      return base;
    }
    let i = 2;
    while (usedEdgeIds.has(`${base}#${i}`)) i++;
    const next = `${base}#${i}`;
    usedEdgeIds.add(next);
    return next;
  };

  const pushEdge = (e: GraphEdge): void => {
    edges.push({ ...e, id: uniqueEdgeId(e.id) });
  };

  // The agent itself is the single root "Start" node. There is exactly one
  // per .agent file (the file's `agent_label`), and it connects to the
  // start_agent subagent so the skeleton has an unambiguous entry point.
  push({
    id: SYSTEM_ID,
    kind: "start",
    label: ast.config.agent_label || ast.config.developer_name || "Agent",
    sublabel: ast.config.agent_type || "Agent",
    data: {
      description: ast.config.description,
      developerName: ast.config.developer_name,
      defaultUser: ast.config.default_agent_user,
      language: ast.language,
      modality: ast.modality,
      connection: ast.connection,
      systemInstructions: ast.systemInstructions,
      systemMessages: ast.systemMessages,
    },
  });

  // Variables
  for (const v of ast.variables) {
    push({
      id: variableNodeId(v.name),
      kind: "variable",
      label: v.name,
      sublabel: v.typeExpr,
      data: {
        description: v.description,
        source: v.source,
        typeExpr: v.typeExpr,
      },
    });
    pushEdge({
      id: `e:owns:sys->var:${v.name}`,
      source: SYSTEM_ID,
      target: variableNodeId(v.name),
      kind: "owns",
      weight: 0.4,
    });
  }

  // Subagents (including start_agent treated as a regular subagent — the
  // sole "Start" root is the system/agent node above).
  const allSubagents: SubagentDef[] = ast.startAgent
    ? [ast.startAgent, ...ast.subagents]
    : ast.subagents;

  // Add the canonical start edge: agent root -> start_agent. This is the
  // single entry transition that anchors the top of the graph.
  if (ast.startAgent) {
    pushEdge({
      id: `e:trans:__system__->${ast.startAgent.id}:entry`,
      source: SYSTEM_ID,
      target: subagentNodeId(ast.startAgent.id),
      kind: "transition",
      label: "starts",
      weight: 1,
    });
  }

  for (const s of allSubagents) {
    push({
      id: subagentNodeId(s.id),
      kind: "subagent",
      label: s.label || s.id,
      sublabel: s.kind === "start_agent" ? "Start Subagent" : "Subagent",
      data: {
        rawId: s.id,
        description: s.description,
        instructions: s.instructions,
        beforeReasoning: s.beforeReasoning,
        afterReasoning: s.afterReasoning,
        actionBindings: s.actionBindings,
      },
    });

    // Inline action definitions live inside the subagent
    for (const a of s.actions) {
      push({
        id: actionNodeId(a.id),
        kind: "action",
        label: a.label || a.id,
        sublabel: a.target ? extractTargetShort(a.target) : "Action",
        data: a as unknown as Record<string, unknown>,
      });
      pushEdge({
        id: `e:owns:sub:${s.id}->act:${a.id}`,
        source: subagentNodeId(s.id),
        target: actionNodeId(a.id),
        kind: "owns",
        weight: 0.6,
      });
    }

    const isStartSubagent = s.kind === "start_agent";

    // Action bindings -> invocations / transitions
    for (const b of s.actionBindings) {
      if (b.transitionTo) {
        pushEdge({
          id: `e:trans:${s.id}->${b.transitionTo}:${b.localName}`,
          source: subagentNodeId(s.id),
          target: subagentNodeId(b.transitionTo),
          kind: "transition",
          label: b.description || b.localName,
          weight: 1,
          primary: isStartSubagent,
        });
        continue;
      }
      const m = b.target.match(/@actions\.([A-Za-z0-9_]+)/);
      if (m) {
        const actionId = m[1];
        push({
          id: actionNodeId(actionId),
          kind: "action",
          label: actionId.replace(/_/g, " "),
          sublabel: "Action",
          data: { id: actionId, referencedFrom: s.id },
        });
        pushEdge({
          id: `e:invoke:sub:${s.id}->act:${actionId}:${b.localName}`,
          source: subagentNodeId(s.id),
          target: actionNodeId(actionId),
          kind: "invokes",
          label: b.localName,
          weight: 0.8,
        });

        // variable reads (with foo = @variables.bar). Include the source
        // subagent + binding so two subagents passing the same variable to the
        // same action don't collide.
        for (const w of b.withParams) {
          const vm = w.value.match(/@variables\.([A-Za-z0-9_]+)/);
          if (vm) {
            pushEdge({
              id: `e:read:sub:${s.id}:${b.localName}:var:${vm[1]}->act:${actionId}:${w.param}`,
              source: variableNodeId(vm[1]),
              target: actionNodeId(actionId),
              kind: "reads",
              label: w.param,
              weight: 0.3,
            });
          }
        }

        // variable writes (set @variables.foo = @outputs.bar)
        for (const setter of b.setsVariables) {
          pushEdge({
            id: `e:write:sub:${s.id}:${b.localName}:act:${actionId}->var:${setter.variable}:${setter.from}`,
            source: actionNodeId(actionId),
            target: variableNodeId(setter.variable),
            kind: "writes",
            label: setter.variable,
            weight: 0.3,
          });
        }
      }
    }

    // Inferred transitions (from before_reasoning / after_reasoning text).
    // Dedupe by (source -> target) within this subagent so we don't emit a
    // separate edge per textual occurrence; uniqueEdgeId still guards against
    // any cross-subagent collision.
    const inferredSeen = new Set<string>();
    for (const t of s.inferredTransitions) {
      const key = `${s.id}->${t.to}`;
      if (inferredSeen.has(key)) continue;
      inferredSeen.add(key);
      pushEdge({
        id: `e:trans:${s.id}->${t.to}:inferred`,
        source: subagentNodeId(s.id),
        target: subagentNodeId(t.to),
        kind: "transition",
        label: t.condition || "transition",
        weight: 0.7,
        primary: isStartSubagent,
      });
    }
  }

  // Top-level action defs (rare)
  for (const a of ast.actions) {
    push({
      id: actionNodeId(a.id),
      kind: "action",
      label: a.label || a.id,
      sublabel: a.target ? extractTargetShort(a.target) : "Action",
      data: a as unknown as Record<string, unknown>,
    });
  }

  // Drop edges that reference unknown nodes (defensive)
  const validIds = new Set(nodes.map((n) => n.id));
  const cleanEdges = edges.filter((e) => validIds.has(e.source) && validIds.has(e.target));

  return { nodes, edges: cleanEdges };
}

export function subagentNodeId(id: string): string {
  return `sub:${id}`;
}
export function actionNodeId(id: string): string {
  return `act:${id}`;
}
export function variableNodeId(id: string): string {
  return `var:${id}`;
}

function extractTargetShort(target: string): string {
  // "apex://NF_GetOrderDetailsHandler" -> "Apex · NF_GetOrderDetailsHandler"
  const m = target.match(/^([a-zA-Z]+):\/\/(.+)$/);
  if (m) return `${m[1].toUpperCase()} · ${m[2]}`;
  return target;
}

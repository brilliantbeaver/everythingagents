"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSessionSource } from "@/lib/visualizer/recents";
import { parseAgentScript } from "@/lib/visualizer/agentscript/parser";
import { buildGraph } from "@/lib/visualizer/agentscript/graph";
import { AgentView } from "./agent-view";
import { ViewError } from "./view-error";

// Renders a graph from a sessionStorage-stored source, used when the
// upload was too large to round-trip through the URL. Resolution must
// happen in the browser since sessionStorage isn't accessible server-side.

export function RefAgentView({ refId }: { refId: string }) {
  const [source, setSource] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const s = getSessionSource(refId);
    if (s === null) {
      setMissing(true);
      return;
    }
    setSource(s);
  }, [refId]);

  const parsed = useMemo(() => {
    if (!source) return null;
    const ast = parseAgentScript(source, "uploaded.agent");
    const graph = buildGraph(ast);
    const fileName = ast.config.developer_name
      ? `${ast.config.developer_name}.agent`
      : "uploaded.agent";
    const label = ast.config.agent_label || ast.config.developer_name || "uploaded";
    return { graph, fileName, label };
  }, [source]);

  if (missing) {
    return (
      <ViewError
        title="That file isn't in this tab anymore"
        body="Large files are kept in this browser tab's session storage. Open it from a fresh tab? Re-upload to generate a new link."
      />
    );
  }

  if (!source || !parsed) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading file from session…
      </div>
    );
  }

  return (
    <AgentView
      fileName={parsed.fileName}
      source={source}
      graph={parsed.graph}
      label={parsed.label}
    />
  );
}

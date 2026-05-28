"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Network, Trash2 } from "lucide-react";
import { GraphCanvas } from "@/components/visualizer/graph/graph-canvas";
import { SourceView } from "@/components/visualizer/source/source-view";
import { cn } from "@/lib/utils";
import type { GraphModel } from "@/lib/visualizer/agentscript/graph";

type Tab = "graph" | "source";

export function AgentView({
  id,
  fileName,
  source,
  graph,
  label,
}: {
  id: string;
  fileName: string;
  source: string;
  graph: GraphModel;
  label: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("graph");
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!confirm(`Delete ${fileName}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/visualizer/agents/${id}`, { method: "DELETE" });
      if (r.ok) {
        window.dispatchEvent(new Event("agents:changed"));
        router.push("/visualizer");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b bg-card px-6 py-3 pr-[140px]">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            AgentScript
          </div>
          <h1 className="truncate text-lg font-semibold">{label}</h1>
          <code className="text-[11px] text-muted-foreground">{fileName}</code>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-background p-0.5">
            <TabButton active={tab === "graph"} onClick={() => setTab("graph")}>
              <Network className="h-3.5 w-3.5" /> Graph
            </TabButton>
            <TabButton active={tab === "source"} onClick={() => setTab("source")}>
              <Code2 className="h-3.5 w-3.5" /> Source
            </TabButton>
          </div>
          <button
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {tab === "graph" ? (
          <GraphCanvas model={graph} agentLabel={label} />
        ) : (
          <SourceView agentId={id} source={source} fileName={fileName} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

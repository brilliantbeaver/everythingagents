"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/visualizer/ui/badge";
import type { AgentNodeData } from "./agent-node";
import type { ActionDef, ActionInputOutput } from "@/lib/visualizer/agentscript/types";

const VARIANT_FOR: Record<string, "subagent" | "action" | "variable" | "system" | "start" | "default"> = {
  start: "start",
  subagent: "subagent",
  action: "action",
  variable: "variable",
  system: "system",
};

export function DetailPanel({
  node,
  onClose,
}: {
  node: { id: string; data: AgentNodeData } | null;
  onClose: () => void;
}) {
  if (!node) return null;
  const { data } = node;
  const variant = VARIANT_FOR[data.kind] ?? "default";

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-[420px] flex-col border-l bg-card shadow-xl">
      <div className="flex items-start justify-between gap-3 border-b p-5">
        <div className="min-w-0">
          <Badge variant={variant}>{data.kind}</Badge>
          <h2 className="mt-2 truncate text-lg font-semibold leading-tight">{data.label}</h2>
          {data.sublabel && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{data.sublabel}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close detail panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <DetailBody data={data} />
      </div>
    </aside>
  );
}

function DetailBody({ data }: { data: AgentNodeData }) {
  const p = (data.payload || {}) as Record<string, unknown>;

  switch (data.kind) {
    case "system":
      return <SystemDetail p={p} />;
    case "subagent":
    case "start":
      return <SubagentDetail p={p} />;
    case "action":
      return <ActionDetail p={p} />;
    case "variable":
      return <VariableDetail p={p} />;
    default:
      return <pre className="whitespace-pre overflow-x-auto text-xs">{JSON.stringify(p, null, 2)}</pre>;
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="text-sm text-foreground">{children}</div>
    </section>
  );
}

function SystemDetail({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      {p.description ? (
        <Section title="Description">
          <p className="leading-relaxed">{String(p.description)}</p>
        </Section>
      ) : null}
      {p.developerName ? (
        <Section title="Developer name">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{String(p.developerName)}</code>
        </Section>
      ) : null}
      {p.modality && typeof p.modality === "object" ? (
        <Section title="Modality">
          <pre className="whitespace-pre overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(p.modality, null, 2)}
          </pre>
        </Section>
      ) : null}
      {p.systemInstructions ? (
        <Section title="System instructions">
          <pre className="max-h-96 overflow-y-auto whitespace-pre overflow-x-auto rounded-md bg-muted/50 p-3 text-xs leading-relaxed">
            {String(p.systemInstructions)}
          </pre>
        </Section>
      ) : null}
    </>
  );
}

function SubagentDetail({ p }: { p: Record<string, unknown> }) {
  const bindings = Array.isArray(p.actionBindings)
    ? (p.actionBindings as Array<Record<string, unknown>>)
    : [];
  return (
    <>
      {p.description ? (
        <Section title="Description">
          <p className="leading-relaxed">{String(p.description)}</p>
        </Section>
      ) : null}
      {p.beforeReasoning ? (
        <Section title="Before reasoning">
          <pre className="whitespace-pre overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
            {String(p.beforeReasoning)}
          </pre>
        </Section>
      ) : null}
      {p.instructions ? (
        <Section title="Reasoning instructions">
          <pre className="max-h-72 overflow-y-auto whitespace-pre overflow-x-auto rounded-md bg-muted/50 p-3 text-xs leading-relaxed">
            {String(p.instructions)}
          </pre>
        </Section>
      ) : null}
      {bindings.length > 0 ? (
        <Section title={`Action bindings (${bindings.length})`}>
          <ul className="space-y-2">
            {bindings.map((b, i) => (
              <li key={i} className="rounded-md border bg-background/50 p-2.5 text-xs">
                <div className="font-mono font-medium">{String(b.localName)}</div>
                <div className="mt-0.5 text-muted-foreground">→ {String(b.target)}</div>
                {b.description ? <div className="mt-1">{String(b.description)}</div> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {p.afterReasoning ? (
        <Section title="After reasoning">
          <pre className="whitespace-pre overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
            {String(p.afterReasoning)}
          </pre>
        </Section>
      ) : null}
    </>
  );
}

function ActionDetail({ p }: { p: Record<string, unknown> }) {
  const action = p as Partial<ActionDef> & { referencedFrom?: string };
  return (
    <>
      {action.description ? (
        <Section title="Description">
          <p className="leading-relaxed">{String(action.description)}</p>
        </Section>
      ) : null}
      {action.target ? (
        <Section title="Target">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{String(action.target)}</code>
        </Section>
      ) : null}
      {action.inputs && action.inputs.length > 0 ? (
        <Section title="Inputs">
          <IOTable rows={action.inputs} />
        </Section>
      ) : null}
      {action.outputs && action.outputs.length > 0 ? (
        <Section title="Outputs">
          <IOTable rows={action.outputs} />
        </Section>
      ) : null}
      {!action.target && !action.inputs && action.referencedFrom ? (
        <p className="text-xs italic text-muted-foreground">
          Referenced from <code className="rounded bg-muted px-1 py-0.5">{action.referencedFrom}</code> but defined elsewhere in the file.
        </p>
      ) : null}
    </>
  );
}

function VariableDetail({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      <Section title="Type">
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{String(p.typeExpr ?? "")}</code>
      </Section>
      {p.description ? (
        <Section title="Description">
          <p className="leading-relaxed">{String(p.description)}</p>
        </Section>
      ) : null}
      {p.source ? (
        <Section title="Source">
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{String(p.source)}</code>
        </Section>
      ) : null}
    </>
  );
}

function IOTable({ rows }: { rows: ActionInputOutput[] }) {
  return (
    <div className="divide-y rounded-md border">
      {rows.map((r, i) => (
        <div key={i} className="flex items-start gap-3 p-2.5 text-xs">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{r.name}</span>
              <span className="text-muted-foreground">{r.typeName}</span>
              {r.isRequired ? (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  required
                </span>
              ) : null}
            </div>
            {r.description ? (
              <div className="mt-0.5 text-muted-foreground">{r.description}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

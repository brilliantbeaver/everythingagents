"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Loader2,
  MessageSquare,
  Plug,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Variable,
  Workflow,
  WrapText,
} from "lucide-react";
import { buildOutline, type OutlineGroup, type OutlineGroupKind } from "@/lib/visualizer/agentscript/outline";
import { cn } from "@/lib/utils";
import { usePersistedState } from "@/lib/visualizer/use-persisted-state";
import type { CodeEditorHandle } from "./code-editor";

// CodeMirror touches `window`/`document` during construction. Load the
// component client-side only to avoid SSR runtime errors in Next.js.
const CodeEditor = dynamic(
  () => import("./code-editor").then((m) => m.CodeEditor),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

const GROUP_ICONS: Record<OutlineGroupKind, React.ComponentType<{ className?: string }>> = {
  settings: SettingsIcon,
  variables: Variable,
  subagents: Boxes,
  actions: Workflow,
  system_messages: MessageSquare,
  connections: Plug,
  modality: Sparkles,
  language: FileCode2,
  other: FileCode2,
};

// Logical sectioning layered on top of the flat outline. AgentScript files
// mix configuration, data, behavior, and runtime channels in arbitrary
// order — bucketing them gives the reader a stable mental model of "what
// kind of thing am I looking at" before diving into specifics.
type SectionKey = "config" | "data" | "agents" | "behavior" | "surfaces" | "other";

interface SectionDef {
  key: SectionKey;
  label: string;
  /** Short hint shown under the section header on first render. */
  hint: string;
  kinds: OutlineGroupKind[];
}

const SECTIONS: SectionDef[] = [
  {
    key: "config",
    label: "Configuration",
    hint: "Identity & top-level settings",
    kinds: ["settings", "language"],
  },
  {
    key: "data",
    label: "Data",
    hint: "Variables the agent reads & writes",
    kinds: ["variables"],
  },
  {
    key: "agents",
    label: "Agents",
    hint: "start_agent and subagent blocks",
    kinds: ["subagents"],
  },
  {
    key: "behavior",
    label: "Behavior",
    hint: "Actions and prompts",
    kinds: ["actions", "system_messages"],
  },
  {
    key: "surfaces",
    label: "Surfaces",
    hint: "Connection and modality",
    kinds: ["connections", "modality"],
  },
  { key: "other", label: "Other", hint: "Unclassified blocks", kinds: ["other"] },
];

const KIND_TO_SECTION: Record<OutlineGroupKind, SectionKey> = (() => {
  const map = {} as Record<OutlineGroupKind, SectionKey>;
  for (const s of SECTIONS) for (const k of s.kinds) map[k] = s.key;
  return map;
})();

interface Props {
  source: string;
  fileName: string;
}

export function SourceView({ source, fileName }: Props) {
  const [buffer, setBuffer] = useState<string>(source);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [lineWrap, setLineWrap] = usePersistedState<boolean>("agentscript:lineWrap", false);
  const editorRef = useRef<CodeEditorHandle | null>(null);

  // Keep buffer in sync if the parent passes a fresh source (e.g. navigation
  // between agent files). The CodeEditor remounts via the source-derived key
  // below to pick up the new initial value.
  useEffect(() => {
    setBuffer(source);
  }, [source]);

  // Live outline computed from the current source.
  const groups = useMemo(() => buildOutline(buffer), [buffer]);

  const filteredGroups: OutlineGroup[] = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0 || g.label.toLowerCase().includes(q));
  }, [groups, query]);

  const lineCount = useMemo(() => buffer.split(/\r?\n/).length, [buffer]);

  const toggleGroup = (key: string): void => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const jumpTo = (line: number): void => {
    editorRef.current?.jumpToLine(line);
  };

  return (
    <div className="flex h-full min-h-0 w-full bg-background">
      {/* Outline */}
      <aside className="flex w-64 shrink-0 flex-col border-r bg-muted/10">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explorer
          </span>
        </div>
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search file..."
              className="w-full rounded-md border bg-background py-1.5 pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {filteredGroups.length === 0 ? (
            <p className="px-3 py-4 text-xs text-muted-foreground">No matches.</p>
          ) : (
            SECTIONS.map((section) => {
              const groupsInSection = filteredGroups.filter(
                (g) => KIND_TO_SECTION[g.kind] === section.key,
              );
              if (groupsInSection.length === 0) return null;
              return (
                <SourceSection
                  key={section.key}
                  section={section}
                  groups={groupsInSection}
                  collapsedGroups={collapsedGroups}
                  onToggleGroup={toggleGroup}
                  onJump={jumpTo}
                />
              );
            })
          )}
        </div>
      </aside>

      {/* Editor */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b bg-card px-3 py-1.5">
          <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">{fileName}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Read-only
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLineWrap(!lineWrap)}
              title={lineWrap ? "Disable line wrap" : "Enable line wrap"}
              aria-pressed={lineWrap}
              className={cn(
                "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium transition",
                lineWrap
                  ? "border-transparent bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              <WrapText className="h-3 w-3" />
              Wrap
            </button>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {lineCount} lines
            </span>
          </div>
        </div>
        <div className="relative min-h-0 flex-1">
          <CodeEditor
            ref={editorRef}
            initialValue={source}
            onChange={(doc) => setBuffer(doc)}
            readOnly
            lineWrap={lineWrap}
          />
        </div>
      </div>
    </div>
  );
}

function SourceSection({
  section,
  groups,
  collapsedGroups,
  onToggleGroup,
  onJump,
}: {
  section: SectionDef;
  groups: OutlineGroup[];
  collapsedGroups: Set<string>;
  onToggleGroup: (key: string) => void;
  onJump: (line: number) => void;
}) {
  return (
    <section className="mt-1 first:mt-0">
      {/* Section header — small uppercase label that anchors the bucket
          visually. Hint underneath orients first-time readers without
          adding a tooltip. */}
      <header className="mt-2 px-3 pb-1 pt-2 first:mt-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {section.label}
        </div>
        <div className="text-[10px] text-muted-foreground/70">{section.hint}</div>
      </header>
      <div className="px-1">
        {groups.map((g) => {
          const Icon = GROUP_ICONS[g.kind];
          const groupKey = `${g.kind}:${g.line}`;
          const isCollapsed = collapsedGroups.has(groupKey);
          const hasChildren = g.items.length > 0;
          return (
            <div key={groupKey} className="mb-0.5">
              <button
                type="button"
                onClick={() => (hasChildren ? onToggleGroup(groupKey) : onJump(g.line))}
                className="group flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-left text-xs font-medium text-foreground hover:bg-muted/60"
              >
                {hasChildren ? (
                  isCollapsed ? (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  )
                ) : (
                  <span className="w-3" />
                )}
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{g.label}</span>
                {hasChildren && (
                  <span className="ml-auto rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-muted-foreground">
                    {g.items.length}
                  </span>
                )}
              </button>
              {!isCollapsed && hasChildren && (
                <ul className="ml-3 border-l pl-2">
                  {g.items.map((it) => (
                    <li key={`${it.label}-${it.line}`}>
                      <button
                        type="button"
                        onClick={() => onJump(it.line)}
                        className="flex w-full items-center gap-1.5 truncate rounded-sm px-2 py-0.5 text-left text-[11px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        title={`Line ${it.line}`}
                      >
                        <span className="truncate">{it.label}</span>
                        <span className="ml-auto text-[10px] tabular-nums text-muted-foreground/70">
                          {it.line}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {/* Subtle divider after each section keeps the buckets visually
          distinct without painting a hard border on every row. */}
      <div className="mx-3 mt-2 border-t border-border/50 last:hidden" />
    </section>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    </div>
  );
}

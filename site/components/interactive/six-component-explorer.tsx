"use client";

import { useState } from "react";

type ComponentKey = "E" | "T" | "C" | "S" | "L" | "V";

interface ComponentInfo {
  key: ComponentKey;
  name: string;
  oneLiner: string;
  function: string;
  failure: string;
  claudeCode: string;
  surveyed: string;
}

const components: ComponentInfo[] = [
  {
    key: "E",
    name: "Execution loop",
    oneLiner: "Observe → think → act → commit. Termination, error recovery.",
    function:
      "Sequences turns. Decides when to stop. Recovers from tool errors instead of crashing or looping forever. Without E there is no multi-step execution at all.",
    failure: "Execution runaway — loops that never terminate, no error-recovery arc.",
    claudeCode:
      "The Claude Code agent loop itself. The bit you don't see: the code that hands the model output back to a tool dispatcher, catches errors, and decides whether to keep going.",
    surveyed: "All real harnesses. Necessary by definition.",
  },
  {
    key: "T",
    name: "Tool registry",
    oneLiner: "Typed, validated catalog. Routes calls. Monitors invocations.",
    function:
      "Holds tool schemas. Validates arguments before dispatch. Routes to the right implementation. Refuses calls that don't match the schema instead of letting the model improvise.",
    failure: "Tool misuse — hallucinated calls, bad arguments, ungoverned composition.",
    claudeCode:
      "Bash, Edit, Read, Grep, Glob, plus any MCP servers you've added. Each has a strict schema; mismatched calls are rejected by the registry, not by the model.",
    surveyed: "All real harnesses. Necessary by definition.",
  },
  {
    key: "C",
    name: "Context manager",
    oneLiner: "What enters the model's window. Compaction, retrieval, ordering.",
    function:
      "Decides what the model sees on each turn. Compacts old messages, retrieves relevant facts, orders the prompt. Most of what 'context engineering' described in 2025 lives here.",
    failure: "Context blowout — history grows unbounded, lost-in-the-middle effects, cost explosion.",
    claudeCode:
      "The compaction strategy when you approach context limit, the ranking of which CLAUDE.md sections appear, which tool-result excerpts get kept versus elided.",
    surveyed: "Heavily implemented; coupled tightly to L (retention vs. security).",
  },
  {
    key: "S",
    name: "State store",
    oneLiner: "What survives turns. Files, git, long-term memory.",
    function:
      "Holds state that needs to outlive a turn — and ideally a whole session. Files on disk, git history, vector stores, structured memory. The thing the agent reads when it 'gets its bearings'.",
    failure: "State loss on failure — multi-step task interrupted, no recovery point.",
    claudeCode:
      "Your repo and its git log. CLAUDE.md memory directory. The progress file convention from Anthropic's long-running-agents pattern.",
    surveyed: "Underbuilt across the field. Often improvised per-project.",
  },
  {
    key: "L",
    name: "Lifecycle hooks",
    oneLiner: "Pre/post interception. Auth, logging, policy, instrumentation.",
    function:
      "Runs before and after every tool call (and often every turn). Authenticates, audits, enforces policy, redacts secrets, captures metrics. Operational, not behavioral.",
    failure: "Unmonitored side effects — agent sends emails, modifies files, no one logs it.",
    claudeCode:
      "PreToolUse and PostToolUse hooks in settings.json. Permission gates. The tool-approval prompt. SessionStart hooks.",
    surveyed:
      "Systematically underbuilt across the surveyed 22 systems. Identified as one of the two ecosystem-wide gaps.",
  },
  {
    key: "V",
    name: "Evaluation interface",
    oneLiner: "Standardized trajectory capture. For downstream judges.",
    function:
      "Emits structured action sequences, intermediate state, success/failure signals — in a canonical schema that benchmarks and observability platforms can directly consume. Not the same as logging.",
    failure: "Unobservable behavior — can't reconstruct what happened, can't compare across systems.",
    claudeCode:
      "The transcript and trace artifacts. Structured trajectories that downstream tooling (HAL, eval harnesses, the meta-harness search agent) can read directly.",
    surveyed:
      "The other systematically underbuilt component. Most systems log; few emit standardized trajectories.",
  },
];

const positions: Record<ComponentKey, { col: number; row: number }> = {
  E: { col: 0, row: 0 },
  T: { col: 1, row: 0 },
  C: { col: 2, row: 0 },
  S: { col: 0, row: 1 },
  L: { col: 1, row: 1 },
  V: { col: 2, row: 1 },
};

export function SixComponentExplorer() {
  const [active, setActive] = useState<ComponentKey>("E");
  const info = components.find((c) => c.key === active)!;

  return (
    <section
      aria-label="Six-component explorer"
      className="my-8 rounded-md border border-border bg-muted/20 p-5"
    >
      <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Explore the six components
      </p>
      <p className="ui-sans mt-1 text-xs text-muted-foreground">
        Click any letter. Each one has a function, a failure mode, and a place where it lives in Claude Code.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
        {/* Letter grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          {components.map((c) => {
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActive(c.key)}
                aria-pressed={isActive}
                title={c.name}
                style={{
                  gridColumnStart: positions[c.key].col + 1,
                  gridRowStart: positions[c.key].row + 1,
                }}
                className={`group flex aspect-square flex-col items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-accent bg-[oklch(96%_0.04_70_/_1)] dark:bg-[oklch(24%_0.04_70_/_1)]"
                    : "border-border bg-background hover:border-accent/60 hover:bg-muted/40"
                }`}
              >
                <span
                  className={`font-mono text-2xl font-bold ${
                    isActive ? "text-accent" : "text-foreground/85 group-hover:text-accent"
                  }`}
                >
                  {c.key}
                </span>
                <span className="ui-sans mt-0.5 text-[10px] text-muted-foreground">
                  {c.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail pane */}
        <div className="min-h-[260px] rounded-md border border-border bg-background p-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold text-accent">{info.key}</span>
            <h3 className="font-serif text-lg font-medium text-foreground">{info.name}</h3>
          </div>
          <p className="ui-sans mt-1 text-xs italic text-muted-foreground">{info.oneLiner}</p>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Function
              </dt>
              <dd className="mt-1 text-foreground/90">{info.function}</dd>
            </div>
            <div>
              <dt className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Failure mode
              </dt>
              <dd className="mt-1 text-foreground/90">{info.failure}</dd>
            </div>
            <div>
              <dt className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Where it lives in Claude Code
              </dt>
              <dd className="mt-1 text-foreground/90">{info.claudeCode}</dd>
            </div>
            <div>
              <dt className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                In the surveyed 22 systems
              </dt>
              <dd className="mt-1 text-foreground/80 italic">{info.surveyed}</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="ui-sans mt-3 text-[10px] text-muted-foreground">
        Source: Meng et al., <em>An Open and Critical Survey of Agent Harnesses</em>, 2026 (§2.2).
      </p>
    </section>
  );
}

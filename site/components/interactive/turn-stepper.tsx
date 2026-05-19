"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type ComponentKey = "E" | "T" | "C" | "S" | "L" | "V";

interface Frame {
  phase: string;
  title: string;
  detail: string;
  active: ComponentKey[];
  example: string;
}

// One real Claude Code turn: user asks "fix the failing test in
// auth_service_test.py". Six frames trace the cycle.
const frames: Frame[] = [
  {
    phase: "observe",
    title: "Read state, compose prompt",
    detail:
      "The harness loads the user message, recent history, the contents of CLAUDE.md, and any relevant tool results from prior turns. The context manager (C) decides what fits.",
    active: ["E", "C", "S"],
    example:
      "user: fix the failing test in auth_service_test.py\nassistant_history: [3 prior tool results, 2 messages]\nCLAUDE.md: [loaded]",
  },
  {
    phase: "observe",
    title: "Pre-call hook fires",
    detail:
      "Lifecycle hooks (L) run before the prompt reaches the model. They can redact secrets, attach metadata, enforce per-session token caps. This turn: nothing is redacted, a request ID is attached.",
    active: ["E", "L"],
    example: "PreModelCall hook: ok (request_id=4f2c, redactions=0)",
  },
  {
    phase: "think",
    title: "Model picks a tool",
    detail:
      "The model reads the composed prompt and emits a tool call. The execution loop (E) parses the call. This is the only LLM-driven step; everything around it is code.",
    active: ["E"],
    example:
      'tool_call: Read\nargs: { file_path: "src/auth_service_test.py" }',
  },
  {
    phase: "act",
    title: "Tool registry validates and dispatches",
    detail:
      "The tool registry (T) checks the call against Read's schema. file_path is a required string — it's present and a string. Pre-tool-use hooks (L) run for permissioning. Then it dispatches to the implementation.",
    active: ["E", "T", "L"],
    example:
      "registry: T.validate(Read, args) → ok\nhook: PreToolUse Read → allowed\ndispatch: read_file('src/auth_service_test.py')",
  },
  {
    phase: "act",
    title: "Tool returns, post-call hook fires",
    detail:
      "The implementation returns 1.4kB of file contents. Post-tool-use hooks (L) run — auditing the call, capturing metrics. The result is appended to the conversation as a tool result message.",
    active: ["E", "T", "L"],
    example:
      "result: <file contents, 1402 bytes>\nhook: PostToolUse Read → audited\nappend: tool_result message",
  },
  {
    phase: "commit",
    title: "Trajectory is captured, state written",
    detail:
      "The evaluation interface (V) emits a structured trajectory entry: tool, args, result hash, latency. The state store (S) writes any updates (cwd, recent-files cache). Loop returns to observe.",
    active: ["E", "S", "V"],
    example:
      "V.emit({ step: 4, tool: 'Read', latency_ms: 14, ok: true })\nS.update({ recent_files: [...] })\nloop → observe",
  },
];

const allComponents: ComponentKey[] = ["E", "T", "C", "S", "L", "V"];

export function TurnStepper() {
  const [i, setI] = useState(0);
  const f = frames[i];

  return (
    <section
      aria-label="Turn stepper"
      className="my-8 rounded-md border border-border bg-muted/20 p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Step through one turn
          </p>
          <p className="ui-sans mt-1 text-xs text-muted-foreground">
            One real Claude Code turn, frame by frame. Watch which components are active at each phase.
          </p>
        </div>
        <div className="ui-sans shrink-0 text-xs tabular-nums text-muted-foreground">
          frame {i + 1} / {frames.length}
        </div>
      </div>

      {/* Component activity strip */}
      <div className="mt-4 flex items-center gap-2">
        {allComponents.map((c) => {
          const on = f.active.includes(c);
          return (
            <span
              key={c}
              className={`inline-flex h-7 w-7 items-center justify-center rounded font-mono text-[12px] font-bold transition-colors ${
                on
                  ? "border border-accent bg-[oklch(96%_0.04_70_/_1)] text-accent dark:bg-[oklch(24%_0.04_70_/_1)]"
                  : "border border-border bg-background text-muted-foreground/40"
              }`}
              title={on ? `${c} is active` : `${c} is idle`}
            >
              {c}
            </span>
          );
        })}
        <span className="ui-sans ml-2 text-[10px] text-muted-foreground">active components</span>
      </div>

      {/* Phase + title */}
      <div className="mt-5 rounded-md border border-border bg-background p-5">
        <div className="flex items-baseline gap-3">
          <span className="ui-sans rounded bg-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/80">
            {f.phase}
          </span>
          <h3 className="font-serif text-base font-medium text-foreground">{f.title}</h3>
        </div>
        <p className="ui-sans mt-3 text-sm text-foreground/85 leading-relaxed">{f.detail}</p>

        <pre className="mt-4 overflow-x-auto rounded border border-border bg-code px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
{f.example}
        </pre>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setI((p) => Math.max(0, p - 1))}
          disabled={i === 0}
          className="ui-sans inline-flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> back
        </button>

        <div className="flex items-center gap-1">
          {frames.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to frame ${idx + 1}`}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                idx === i ? "bg-accent" : "bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setI(0)}
            className="ui-sans inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Reset to first frame"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setI((p) => Math.min(frames.length - 1, p + 1))}
            disabled={i === frames.length - 1}
            className="ui-sans inline-flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

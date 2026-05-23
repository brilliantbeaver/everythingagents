"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";

type ComponentKey = "E" | "T" | "C" | "S" | "L" | "V";

interface ScenarioStep {
  turn: number;
  phase: "observe" | "think" | "act" | "commit";
  action: string;
  detail: string;
  // Outcomes when various components are disabled.
  // The first matching disabled component decides the outcome.
  failsIfDisabled?: { [K in ComponentKey]?: string };
  contextDelta: number; // tokens consumed this step
  stateWrite?: string; // what S persists
  toolCall?: { name: string; ok: boolean };
}

interface Scenario {
  id: string;
  goal: string;
  description: string;
  steps: ScenarioStep[];
  successMessage: string;
}

// Two scenarios: a quick "fix the test" task that should succeed under
// a complete harness, and a long-running "build a small TODO app" task
// that exposes context-management and state-persistence issues.

const scenarios: Scenario[] = [
  {
    id: "fix-test",
    goal: "Fix the failing test in auth_service_test.py",
    description: "A short, well-scoped task. Three turns, one tool call each.",
    steps: [
      {
        turn: 1,
        phase: "observe",
        action: "load context",
        detail: "Read CLAUDE.md and recent file cache.",
        failsIfDisabled: { C: "no context manager → entire history dumped, model truncates mid-prompt" },
        contextDelta: 1200,
      },
      {
        turn: 1,
        phase: "think",
        action: "model: read the test file",
        detail: "Picks Read tool with file_path argument.",
        contextDelta: 400,
      },
      {
        turn: 1,
        phase: "act",
        action: "Read('auth_service_test.py')",
        detail: "Tool registry validates schema, hooks check permission, file is read.",
        failsIfDisabled: {
          T: "no tool registry → unvalidated call; model can fabricate tool name and crash the loop",
          L: "no lifecycle hooks → call runs without permission check or audit log",
        },
        toolCall: { name: "Read", ok: true },
        contextDelta: 1400,
      },
      {
        turn: 1,
        phase: "commit",
        action: "trace step, append result",
        detail: "V emits structured trajectory entry; turn 1 closes.",
        failsIfDisabled: { V: "no trajectory capture → can't reproduce, can't score offline" },
        contextDelta: 60,
      },
      {
        turn: 2,
        phase: "think",
        action: "model: edit the wrong assertion",
        detail: "Identifies a stale `expect()` and proposes an Edit.",
        contextDelta: 500,
      },
      {
        turn: 2,
        phase: "act",
        action: "Edit('auth_service_test.py', ...)",
        detail: "Schema valid; hook approves; the edit is applied.",
        toolCall: { name: "Edit", ok: true },
        contextDelta: 200,
      },
      {
        turn: 3,
        phase: "act",
        action: "Bash('pytest -x')",
        detail: "Pre-tool hook checks command against allowlist. Test passes.",
        failsIfDisabled: {
          L: "no hook → arbitrary shell runs unchecked; supply-chain risk and no audit trail",
        },
        toolCall: { name: "Bash", ok: true },
        contextDelta: 300,
      },
      {
        turn: 3,
        phase: "commit",
        action: "write recent-files cache",
        detail: "S persists the touched files list for the next session.",
        failsIfDisabled: {
          S: "no state store → next session starts blind; user re-explains what was already done",
        },
        stateWrite: "recent_files += ['auth_service_test.py']",
        contextDelta: 50,
      },
    ],
    successMessage: "Test passes. Three turns, four tool calls, one file modified.",
  },
  {
    id: "build-todo",
    goal: "Build a small TODO app and verify it works",
    description:
      "A longer task that crosses what could be one or several context windows. Watch the context bar and the state writes.",
    steps: [
      {
        turn: 1,
        phase: "observe",
        action: "read progress.txt + features.json",
        detail: "Coding-agent preamble: get bearings before doing anything.",
        failsIfDisabled: {
          S: "no state store → no progress file. Agent re-plans from zero every session.",
        },
        contextDelta: 1800,
      },
      {
        turn: 1,
        phase: "act",
        action: "Bash('./init.sh')",
        detail: "Bring up dev server. Confirms environment matches what the previous session left.",
        toolCall: { name: "Bash", ok: true },
        contextDelta: 400,
      },
      {
        turn: 2,
        phase: "think",
        action: "pick one unfinished feature",
        detail: "From features.json: 'add toggle-completed checkbox'. Single feature, not the whole app.",
        contextDelta: 600,
      },
      {
        turn: 2,
        phase: "act",
        action: "Edit + Edit + Bash(test)",
        detail: "Implement, then run the unit tests. Hook gates the bash call.",
        toolCall: { name: "Edit/Bash", ok: true },
        contextDelta: 4200,
      },
      {
        turn: 3,
        phase: "act",
        action: "Browser('localhost:3000')",
        detail:
          "End-to-end check: click the toggle, confirm UI updates. Catches 'unit test passed but it doesn't actually work' bugs.",
        failsIfDisabled: {
          T: "no end-to-end tool → ships features that pass unit tests but fail in the browser",
        },
        toolCall: { name: "Browser", ok: true },
        contextDelta: 2200,
      },
      {
        turn: 4,
        phase: "commit",
        action: "git commit; flip passes:true; append progress.txt",
        detail: "Durable handoff. Next session can find this work without asking the user.",
        failsIfDisabled: {
          S: "no state writes → next session declares victory or restarts the same feature",
          V: "no trajectory → no way to debug why this turn worked when others didn't",
        },
        stateWrite: "features.toggle_completed.passes = true",
        contextDelta: 300,
      },
      {
        turn: 5,
        phase: "observe",
        action: "compaction triggers",
        detail:
          "Context near its budget. C summarizes the last 4 turns. The summary keeps decisions, drops verbose tool outputs.",
        failsIfDisabled: {
          C: "no context manager → window overflows mid-feature; turn fails with a truncation error",
        },
        contextDelta: -6000,
      },
      {
        turn: 5,
        phase: "act",
        action: "pick next feature",
        detail: "Pattern repeats. Each feature ends with a verified state write.",
        contextDelta: 800,
      },
    ],
    successMessage: "App built incrementally. State survives compaction; handoff survives sessions.",
  },
];

const componentInfo: Record<ComponentKey, { name: string; pos: { col: number; row: number } }> = {
  E: { name: "execution loop", pos: { col: 0, row: 0 } },
  T: { name: "tool registry", pos: { col: 1, row: 0 } },
  C: { name: "context manager", pos: { col: 2, row: 0 } },
  S: { name: "state store", pos: { col: 0, row: 1 } },
  L: { name: "lifecycle hooks", pos: { col: 1, row: 1 } },
  V: { name: "evaluation", pos: { col: 2, row: 1 } },
};

const allComponents: ComponentKey[] = ["E", "T", "C", "S", "L", "V"];

const CONTEXT_BUDGET = 12000;

export function HarnessSimulator() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  );

  // Components: E and T are required (can't be toggled off).
  const [enabled, setEnabled] = useState<Record<ComponentKey, boolean>>({
    E: true,
    T: true,
    C: true,
    S: true,
    L: true,
    V: true,
  });

  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);

  // Compute effects up to current step
  const events = useMemo(() => {
    const log: { turn: number; ok: boolean; phase: string; line: string; detail?: string }[] = [];
    let context = 0;
    const stateWrites: string[] = [];
    let aborted = false;

    for (let i = 0; i <= Math.min(stepIdx, scenario.steps.length - 1); i++) {
      if (aborted) break;
      const step = scenario.steps[i];

      // Check disabled components
      const disabledFailure = step.failsIfDisabled
        ? (Object.keys(step.failsIfDisabled) as ComponentKey[]).find(
            (k) => !enabled[k],
          )
        : undefined;

      if (disabledFailure) {
        log.push({
          turn: step.turn,
          ok: false,
          phase: step.phase,
          line: `${step.action}: failed`,
          detail: step.failsIfDisabled![disabledFailure],
        });
        aborted = true;
        break;
      }

      context += step.contextDelta;
      if (context < 0) context = 0;
      if (context > CONTEXT_BUDGET) {
        log.push({
          turn: step.turn,
          ok: false,
          phase: step.phase,
          line: "context budget exceeded",
          detail:
            "C never compacted; the window overflowed. Turn aborts; the user has to restart with less in scope.",
        });
        aborted = true;
        break;
      }

      log.push({
        turn: step.turn,
        ok: true,
        phase: step.phase,
        line: step.action,
        detail: step.detail,
      });

      if (step.stateWrite && enabled.S) {
        stateWrites.push(step.stateWrite);
      }
    }

    return { log, context, stateWrites, aborted };
  }, [stepIdx, scenario, enabled]);

  // Auto-step when running
  useEffect(() => {
    if (!running) return;
    if (stepIdx >= scenario.steps.length - 1) {
      setRunning(false);
      return;
    }
    const ms = speed === 2 ? 500 : 1100;
    const t = window.setTimeout(() => setStepIdx((p) => p + 1), ms);
    return () => window.clearTimeout(t);
  }, [running, stepIdx, scenario.steps.length, speed]);

  function reset(toScenario?: string) {
    if (toScenario) setScenarioId(toScenario);
    setStepIdx(0);
    setRunning(false);
  }

  function toggleComponent(k: ComponentKey) {
    if (k === "E" || k === "T") return; // required
    setEnabled((p) => ({ ...p, [k]: !p[k] }));
    // Invalidate the run when a toggle changes
    setStepIdx(0);
    setRunning(false);
  }

  const done = stepIdx >= scenario.steps.length - 1 && !events.aborted;
  const ctxPct = Math.min(100, Math.max(0, (events.context / CONTEXT_BUDGET) * 100));

  return (
    <section
      aria-label="Harness simulator"
      className="my-10 rounded-md border border-border bg-muted/20 p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Harness simulator
          </p>
          <p className="ui-sans mt-1 text-xs text-muted-foreground">
            Pick a goal, pick which components are enabled, and step the harness through. Disable a component to see what it actually does.
          </p>
        </div>
        <span className="ui-sans shrink-0 text-xs tabular-nums text-muted-foreground">
          step {Math.min(stepIdx + 1, scenario.steps.length)} / {scenario.steps.length}
        </span>
      </div>

      {/* Scenario picker */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Goal
        </span>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => reset(s.id)}
              aria-pressed={s.id === scenario.id}
              className={`ui-sans rounded border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                s.id === scenario.id
                  ? "border-accent bg-[oklch(96%_0.04_70_/_1)] text-accent dark:bg-[oklch(24%_0.04_70_/_1)]"
                  : "border-border bg-background text-foreground/80 hover:border-accent/60"
              }`}
            >
              {s.goal}
            </button>
          ))}
        </div>
      </div>

      <p className="ui-sans mt-2 text-xs italic text-muted-foreground">{scenario.description}</p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        {/* Left panel: component toggles */}
        <div className="space-y-4">
          <div>
            <p className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Components
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {allComponents.map((k) => {
                const on = enabled[k];
                const required = k === "E" || k === "T";
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleComponent(k)}
                    disabled={required}
                    title={
                      required
                        ? `${componentInfo[k].name} (required)`
                        : `${on ? "Disable" : "Enable"} ${componentInfo[k].name}`
                    }
                    style={{
                      gridColumnStart: componentInfo[k].pos.col + 1,
                      gridRowStart: componentInfo[k].pos.row + 1,
                    }}
                    className={`group flex aspect-square flex-col items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      on
                        ? "border-accent bg-[oklch(96%_0.04_70_/_1)] dark:bg-[oklch(24%_0.04_70_/_1)]"
                        : "border-dashed border-border bg-background opacity-60"
                    } ${required ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`font-mono text-base font-bold ${
                        on ? "text-accent" : "text-muted-foreground/50 line-through"
                      }`}
                    >
                      {k}
                    </span>
                    <span className="ui-sans mt-0 text-[8.5px] text-muted-foreground">
                      {componentInfo[k].name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="ui-sans mt-2 text-[10px] text-muted-foreground">
              E and T are required by definition. Click C, S, L, or V to disable.
            </p>
          </div>

          {/* Context budget */}
          <div>
            <div className="flex items-baseline justify-between">
              <p className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Context window
              </p>
              <span className="ui-sans text-[10px] tabular-nums text-muted-foreground">
                {events.context.toLocaleString()} / {CONTEXT_BUDGET.toLocaleString()} tok
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-300 ${
                  ctxPct > 85 ? "bg-[oklch(60%_0.18_30)]" : "bg-accent"
                }`}
                style={{ width: `${ctxPct}%` }}
              />
            </div>
          </div>

          {/* Persisted state */}
          <div>
            <p className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Persisted state (S)
            </p>
            <div className="mt-1.5 rounded border border-border bg-background p-2 font-mono text-[10.5px] leading-relaxed text-foreground/80">
              {events.stateWrites.length === 0 ? (
                <span className="text-muted-foreground/60">(nothing yet)</span>
              ) : (
                events.stateWrites.map((w, i) => (
                  <div key={i} className="truncate">
                    {w}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right panel: trace */}
        <div className="rounded-md border border-border bg-background p-4">
          <p className="ui-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Trace
          </p>
          <ol className="mt-2 space-y-2">
            {events.log.length === 0 && (
              <li className="ui-sans text-xs italic text-muted-foreground">
                Press <span className="font-mono">play</span> to step the harness.
              </li>
            )}
            {events.log.map((e, i) => (
              <li key={i} className="text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="ui-sans w-10 shrink-0 font-mono tabular-nums text-muted-foreground">
                    T{e.turn}
                  </span>
                  <span className="ui-sans w-14 shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-[10px] uppercase tracking-[0.04em] text-foreground/70">
                    {e.phase}
                  </span>
                  <span
                    className={`flex-1 font-mono ${
                      e.ok ? "text-foreground/90" : "text-[oklch(55%_0.16_30)] dark:text-[oklch(75%_0.13_30)]"
                    }`}
                  >
                    {e.ok ? "✓" : "✗"} {e.line}
                  </span>
                </div>
                {e.detail && (
                  <p
                    className={`ui-sans ml-[4.5rem] mt-0.5 text-[11px] ${
                      e.ok ? "text-muted-foreground" : "text-[oklch(50%_0.16_30)] dark:text-[oklch(72%_0.13_30)]"
                    }`}
                  >
                    {e.detail}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {done && !events.aborted && (
            <div className="mt-4 rounded border border-accent/50 bg-[oklch(96%_0.04_70_/_1)] dark:bg-[oklch(22%_0.04_70_/_1)] px-3 py-2">
              <p className="ui-sans text-xs font-medium text-accent">{scenario.successMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={done || events.aborted}
          className="ui-sans inline-flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? "pause" : "play"}
        </button>

        <button
          type="button"
          onClick={() =>
            setStepIdx((p) => Math.min(scenario.steps.length - 1, p + 1))
          }
          disabled={done || events.aborted}
          className="ui-sans inline-flex items-center gap-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:border-accent hover:text-accent disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          step
        </button>

        <button
          type="button"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
          aria-pressed={speed === 2}
          className={`ui-sans inline-flex items-center gap-1 rounded border px-2 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            speed === 2
              ? "border-accent bg-[oklch(96%_0.04_70_/_1)] text-accent dark:bg-[oklch(24%_0.04_70_/_1)]"
              : "border-border bg-background text-foreground/70 hover:border-accent/60"
          }`}
          title="Toggle 2× speed"
        >
          <FastForward className="h-3.5 w-3.5" />
          {speed}×
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="ui-sans ml-auto inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          reset
        </button>
      </div>

      {events.aborted && (
        <p className="ui-sans mt-3 text-[11px] text-muted-foreground">
          The harness aborted because a required component was disabled or the budget was exceeded. Re-enable the component or pick a smaller goal and try again.
        </p>
      )}
    </section>
  );
}

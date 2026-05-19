export interface Lesson {
  slug: string;
  number: number;
  title: string;
  keyIdea: string;
  minutes: number;
}

export interface Topic {
  slug: string;
  title: string;
  shortTitle: string;
  oneLine: string;
  prereqs?: string;
  status: "available" | "draft" | "upcoming";
  lessons: Lesson[];
}

export const topics: Topic[] = [
  {
    slug: "guided-determinism",
    title: "Guided determinism for agents using AgentScript",
    shortTitle: "Guided determinism",
    oneLine:
      "Combining LLM flexibility with deterministic gates in Agentforce. Built around one real refund agent.",
    prereqs:
      "Comfortable reading Apex and YAML-shaped DSLs. No prior Agent Script needed.",
    status: "available",
    lessons: [
      {
        slug: "01-the-scenario",
        number: 1,
        title: "The scenario",
        keyIdea:
          "Read this first. Every snippet, diagram, and bug in the tutorial comes from this one refund agent.",
        minutes: 6,
      },
      {
        slug: "02-why-this-is-hard",
        number: 2,
        title: "Why this is hard",
        keyIdea:
          "Pure-prompt agents stall. Pure-deterministic agents are brittle. Guided determinism is the middle path.",
        minutes: 4,
      },
      {
        slug: "03-the-mental-model",
        number: 3,
        title: "The mental model: four control surfaces",
        keyIdea:
          "Topic boundaries, instructions, available-when gates, and after_reasoning. Knowing which to reach for first is the whole skill.",
        minutes: 5,
      },
      {
        slug: "04-anatomy-of-a-turn",
        number: 4,
        title: "Anatomy of a turn",
        keyIdea:
          "What actually happens between user input and assistant reply. Enabled tools are computed before the LLM sees anything.",
        minutes: 5,
      },
      {
        slug: "05-invocable-apex",
        number: 5,
        title: "Invocable Apex: writing actions worth trusting",
        keyIdea:
          "Bulk shape, reserved names, truthful nulls, deterministic outputs. Stubs that lie poison the planner.",
        minutes: 6,
      },
      {
        slug: "06-toolchain",
        number: 6,
        title: "The toolchain and the dev loop",
        keyIdea:
          "Edit, validate, deploy, preview, trace, fix, publish, activate. Don't publish during inner-loop iteration.",
        minutes: 5,
      },
      {
        slug: "07-reading-traces",
        number: 7,
        title: "Reading session traces",
        keyIdea:
          "Traces are the truth. EnabledToolsStep tells you what the LLM saw; VariableUpdateStep tells you why state changed.",
        minutes: 6,
      },
      {
        slug: "08-bug-permission-filter",
        number: 8,
        title: "Bug 1: the silent permission filter",
        keyIdea:
          "The agent runs as the Einstein Agent User, not you. Apex without permset access disappears from enabled_tools with no error.",
        minutes: 6,
      },
      {
        slug: "09-bug-planner-lies",
        number: 9,
        title: "Bug 2: the planner that lies",
        keyIdea:
          "@outputs.X is what the planner says Apex returned. Vague schemas plus sticky context produce convincing fabrications.",
        minutes: 7,
      },
      {
        slug: "10-defense-in-depth",
        number: 10,
        title: "Defense in depth",
        keyIdea:
          "Schema descriptions, flag-based gates, server nonces, re-fetch on next action. Layer 2-3 anywhere stakes are real.",
        minutes: 5,
      },
      {
        slug: "11-free-roam",
        number: 11,
        title: "The free-roam variant: when to relax",
        keyIdea:
          "Same Apex and same gates, prompt-only orchestration. Safe because the deterministic surfaces stay intact.",
        minutes: 4,
      },
      {
        slug: "12-research",
        number: 12,
        title: "Where this fits in AI research",
        keyIdea:
          "Neuro-symbolic Type-2 hybrid. ReAct + constrained generation. Not model-based RL, not Soar.",
        minutes: 9,
      },
      {
        slug: "13-glossary",
        number: 13,
        title: "Glossary",
        keyIdea: "Every term-of-art used across the tutorial, with one-line definitions.",
        minutes: 3,
      },
      {
        slug: "14-sticky-notes",
        number: 14,
        title: "Sticky-note appendix",
        keyIdea: "The seven things we wish we had known on day one.",
        minutes: 2,
      },
    ],
  },
  {
    slug: "agent-harnesses",
    title: "Demystifying Agent Harnesses",
    shortTitle: "Agent harnesses",
    oneLine:
      "What's actually inside an agent harness, how the planner-tools-executor loop runs, and where each design knob lives. Coding agents are the running example; the patterns generalize.",
    prereqs:
      "You've used an agent of some kind (Claude Code, Cursor, a research agent, a customer-service bot). Comfortable reading shell, Python, and JSON. No prior harness theory needed.",
    status: "available",
    lessons: [
      {
        slug: "01-what-is-a-harness",
        number: 1,
        title: "What is a harness, really?",
        keyIdea:
          "A harness is the code around the model that decides what it sees, what it can call, and what survives between turns. Not the model. Not the prompt. The runtime around them.",
        minutes: 5,
      },
      {
        slug: "02-the-six-components",
        number: 2,
        title: "The six components: E, T, C, S, L, V",
        keyIdea:
          "Every harness implements six runtime functions: Execution loop, Tool registry, Context manager, State store, Lifecycle hooks, and Evaluation interface. Six failure modes map one-to-one.",
        minutes: 7,
      },
      {
        slug: "03-anatomy-of-a-turn",
        number: 3,
        title: "Anatomy of one harness turn",
        keyIdea:
          "Observe → think → act → commit. The deterministic stages around the model are where almost all harness design happens.",
        minutes: 6,
      },
      {
        slug: "04-context-management",
        number: 4,
        title: "Context: compaction, resets, and anxiety",
        keyIdea:
          "Two ways past the context limit: summarize in place, or reset and hand off via files. Choice depends on the model and what your handoff artifacts can carry.",
        minutes: 7,
      },
      {
        slug: "05-tool-registry",
        number: 5,
        title: "The tool registry and what makes it trustworthy",
        keyIdea:
          "Tools are typed, validated, and gated. The registry is where hallucinated calls become impossible — or where they slip through.",
        minutes: 5,
      },
      {
        slug: "06-state-and-lifecycle",
        number: 6,
        title: "State stores and lifecycle hooks",
        keyIdea:
          "State (S) is what survives turns. Lifecycle hooks (L) intercept every call for auth, logging, and policy. Both are systematically underbuilt.",
        minutes: 5,
      },
      {
        slug: "07-evaluation-interface",
        number: 7,
        title: "The evaluation interface — and why it's underbuilt",
        keyIdea:
          "V captures structured trajectories so something downstream can score them. Most harnesses log to text and stop there. That's why traces win and summaries lose.",
        minutes: 5,
      },
      {
        slug: "08-failure-modes",
        number: 8,
        title: "Six failure modes, six fixes",
        keyIdea:
          "Execution runaway, tool misuse, context blowout, state loss, unmonitored side effects, unobservable behavior. Each maps to one component, each has a known harness-level fix.",
        minutes: 6,
      },
      {
        slug: "09-generator-evaluator",
        number: 9,
        title: "The generator–evaluator loop",
        keyIdea:
          "Self-evaluation is unreliable. Splitting the doer from the judge — and tuning the judge to be skeptical — is the first structural lever you reach for on subjective work.",
        minutes: 6,
      },
      {
        slug: "10-initializer-coding-agent",
        number: 10,
        title: "The initializer + coding-agent pattern",
        keyIdea:
          "Two prompts, one harness. The initializer writes durable artifacts; the coding agent reads them at session start. This is how Claude Code stays coherent across days.",
        minutes: 5,
      },
      {
        slug: "11-natural-language-harnesses",
        number: 11,
        title: "Natural-language harnesses (CLAUDE.md, skills, AGENTS.md)",
        keyIdea:
          "The control logic of a harness can live in editable text. Contracts, roles, stages, state semantics, failure taxonomy — written once, run by a shared runtime.",
        minutes: 6,
      },
      {
        slug: "12-meta-harness",
        number: 12,
        title: "Meta-harness: searching the harness space",
        keyIdea:
          "If harness design matters this much, automate it. Give a coding agent grep-and-cat over prior runs and let it propose new harnesses. Raw traces beat summaries by a wide margin.",
        minutes: 6,
      },
      {
        slug: "13-glossary",
        number: 13,
        title: "Glossary",
        keyIdea: "Every term-of-art used across the topic, with one-line definitions.",
        minutes: 3,
      },
      {
        slug: "14-sticky-notes",
        number: 14,
        title: "Sticky-note appendix",
        keyIdea: "The seven things that change how you read every harness paper afterward.",
        minutes: 2,
      },
    ],
  },
  {
    slug: "vibe-coding-reliable-agents",
    title: "Vibe Coding Reliable Agents",
    shortTitle: "Vibe coding agents",
    oneLine:
      "Coding fluently with an agent in the loop while keeping the system reliable. The instincts and the guardrails.",
    status: "upcoming",
    lessons: [],
  },
  {
    slug: "testing-agents",
    title: "Testing Agents",
    shortTitle: "Testing agents",
    oneLine:
      "Writing test specs, asserting on tool calls, and reading run results. What stays deterministic and what doesn't.",
    status: "upcoming",
    lessons: [],
  },
  {
    slug: "observing-agents",
    title: "Observing Agents",
    shortTitle: "Observing agents",
    oneLine:
      "Pulling session traces, parsing them, and turning behavior signals into actionable diagnostics.",
    status: "upcoming",
    lessons: [],
  },
  {
    slug: "autotuning-agents",
    title: "Autotuning and Optimizing Agents",
    shortTitle: "Autotuning agents",
    oneLine:
      "Closing the loop: using observations to autotune prompts, gates, and tool choice without sacrificing correctness.",
    status: "upcoming",
    lessons: [],
  },
];

export function topicMinutes(t: Topic): number {
  return t.lessons.reduce((sum, l) => sum + l.minutes, 0);
}

export function findTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function findLesson(topicSlug: string, lessonSlug: string): { topic: Topic; lesson: Lesson } | undefined {
  const topic = findTopic(topicSlug);
  if (!topic) return undefined;
  const lesson = topic.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { topic, lesson };
}

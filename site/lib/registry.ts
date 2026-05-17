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
    slug: "agent-coding-harnesses",
    title: "Demystifying Agent Coding Harnesses",
    shortTitle: "Agent coding harnesses",
    oneLine:
      "What's actually inside a coding harness, how the planner-tools-executor loop runs, and where each design knob lives.",
    status: "upcoming",
    lessons: [],
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

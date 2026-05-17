import type { ComponentProps } from "react";
import { KeyIdea } from "./key-idea";
import { Callout } from "./callout";
import { Mermaid } from "./mermaid";
import { KnowledgeCheck, Option, Explanation } from "./knowledge-check";
import { Steps, Step } from "./steps";
import { Term } from "./term";
import { SpectrumIllustration } from "@/components/illustrations/spectrum";
import { ControlSurfaceStack } from "@/components/illustrations/control-stack";
import { HallucinationLeak } from "@/components/illustrations/hallucination-leak";
import { DefenseOnion } from "@/components/illustrations/defense-onion";
import { RefundAgentCutaway } from "@/components/illustrations/refund-agent-cutaway";
import { TwoFailureModes } from "@/components/illustrations/two-failure-modes";
import { TurnPipeline } from "@/components/illustrations/turn-pipeline";
import { TraceTimeline } from "@/components/illustrations/trace-timeline";
import { LineageConvergence } from "@/components/illustrations/lineage-convergence";
import { DevLoop } from "@/components/illustrations/dev-loop";

function H2(props: ComponentProps<"h2">) {
  return <h2 {...props} className="ui-sans mt-12 scroll-mt-20 font-serif text-2xl font-medium tracking-tight text-foreground" />;
}
function H3(props: ComponentProps<"h3">) {
  return <h3 {...props} className="ui-sans mt-8 scroll-mt-20 font-serif text-xl font-medium tracking-tight text-foreground" />;
}
function P(props: ComponentProps<"p">) {
  return <p {...props} className="my-4 leading-relaxed text-foreground/90" />;
}
function UL(props: ComponentProps<"ul">) {
  return <ul {...props} className="my-4 list-disc pl-6 text-foreground/90 [&>li]:my-1" />;
}
function OL(props: ComponentProps<"ol">) {
  return <ol {...props} className="my-4 list-decimal pl-6 text-foreground/90 [&>li]:my-1" />;
}
function Blockquote(props: ComponentProps<"blockquote">) {
  return <blockquote {...props} className="my-6 border-l-2 border-accent/60 pl-4 italic text-foreground/85" />;
}
function HR(props: ComponentProps<"hr">) {
  return <hr {...props} className="my-10 border-border" />;
}
function Table(props: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-md border border-border">
      <table {...props} className="w-full border-collapse text-sm" />
    </div>
  );
}
function THead(props: ComponentProps<"thead">) {
  return <thead {...props} className="border-b border-border" />;
}
function TBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} className="divide-y divide-border" />;
}
function TR(props: ComponentProps<"tr">) {
  return <tr {...props} className="transition-colors hover:bg-muted/30" />;
}
function TH(props: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className="ui-sans px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground first:pl-5 last:pr-5"
    />
  );
}
function TD(props: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className="px-4 py-3 align-top text-foreground/85 leading-relaxed first:pl-5 first:font-medium first:text-foreground/95 last:pr-5"
    />
  );
}
function InlineCode(props: ComponentProps<"code">) {
  return <code {...props} className="rounded bg-code px-1 py-0.5 font-mono text-[0.875em] text-foreground" />;
}
function Pre(props: ComponentProps<"pre">) {
  return <pre {...props} className="my-4 overflow-x-auto rounded-md border border-border bg-code px-4 py-3 font-mono text-[0.875em] leading-relaxed text-foreground" />;
}
function A(props: ComponentProps<"a">) {
  return <a {...props} className="text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline" />;
}

export const mdxComponents = {
  h2: H2, h3: H3, p: P, ul: UL, ol: OL,
  blockquote: Blockquote, hr: HR, table: Table, th: TH, td: TD,
  code: InlineCode, pre: Pre, a: A,
  KeyIdea, Callout, Mermaid, KnowledgeCheck, Option, Explanation, Steps, Step, Term,
  SpectrumIllustration, ControlSurfaceStack, HallucinationLeak, DefenseOnion, RefundAgentCutaway,
  TwoFailureModes, TurnPipeline, TraceTimeline, LineageConvergence, DevLoop,
};

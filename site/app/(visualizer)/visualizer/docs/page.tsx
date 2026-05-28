import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/visualizer/ui/card";

export default function DocsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-6xl grid-cols-[220px_1fr] gap-10 px-8 py-12">
        <nav className="sticky top-12 self-start text-sm">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            On this page
          </div>
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              External
            </div>
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {l.label} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="prose-headings:tracking-tight">
          <header className="mb-8">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Documentation
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">AgentScript primer</h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              AgentScript is a YAML-flavored declarative format Salesforce Agentforce uses to
              describe an agent: its system instructions, configuration, variables, and the
              subagents that handle distinct intents. This primer covers the syntax surface this
              app visualizes.
            </p>
          </header>

          {SECTIONS.map((s) => (
            <Section key={s.id} id={s.id} title={s.title}>
              {s.body}
            </Section>
          ))}

          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-base">Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Open any uploaded file from the sidebar to see how these constructs render in
                the graph. Click a node to inspect its source-derived metadata in the side
                panel. Switch to the <strong>Source</strong> tab to read the original file.
              </p>
              <p className="mt-3 text-sm">
                <Link href="/visualizer/upload" className="font-medium text-accent hover:underline">
                  Upload your first .agent file →
                </Link>
              </p>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-12">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-[12.5px] leading-relaxed">
      {children}
    </pre>
  );
}

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "structure",
    title: "File structure",
    body: (
      <>
        <p>
          A <code>.agent</code> file is a flat sequence of top-level blocks. Indentation defines
          containment (similar to YAML), and most blocks accept either inline values or block
          scalars introduced with <code>|</code> or <code>-&gt;</code>.
        </p>
        <CodeBlock>{`system:
    instructions: |
        ...
config:
    developer_name: "Target_Service_Agent"
variables:
    order_number: mutable string = ""
start_agent subagent_selector:
    ...
subagent returns:
    ...
modality voice:
    voice_id: "..."`}</CodeBlock>
      </>
    ),
  },
  {
    id: "system",
    title: "system",
    body: (
      <>
        <p>
          The <code>system</code> block carries the agent&apos;s top-level instructions and the
          built-in messages (e.g. <code>welcome</code>, <code>error</code>) returned to the
          customer.
        </p>
        <CodeBlock>{`system:
    instructions: |
        You are Target's customer service AI agent...
    messages:
        welcome: |
            Hi, I'm Target's AI assistant.
        error: "Sorry, something went wrong."`}</CodeBlock>
      </>
    ),
  },
  {
    id: "config",
    title: "config",
    body: (
      <>
        <p>Identifies the agent and provides metadata used by the platform.</p>
        <CodeBlock>{`config:
    developer_name: "Target_Service_Agent"
    agent_label: "Target Service Agent"
    agent_type: "AgentforceServiceAgent"
    description: "Customer service agent for returns and price match."`}</CodeBlock>
      </>
    ),
  },
  {
    id: "variables",
    title: "variables",
    body: (
      <>
        <p>
          Typed slots referenced from reasoning and action wiring. Variables can be{" "}
          <code>mutable</code> or <code>linked</code> (bound to a record source like{" "}
          <code>@VoiceCall.Id</code>).
        </p>
        <CodeBlock>{`variables:
    order_number: mutable string = ""
        description: "The customer's order number..."
    customer_verified: mutable boolean = False
        description: "Identity-verification gate."
    VoiceCallId: linked string
        source: @VoiceCall.Id`}</CodeBlock>
      </>
    ),
  },
  {
    id: "start-agent",
    title: "start_agent",
    body: (
      <>
        <p>
          The entry router. Like a subagent, but it&apos;s where every conversation begins. Most
          start agents are pure routers — their only job is to call a transition action.
        </p>
        <CodeBlock>{`start_agent subagent_selector:
    label: "Subagent Selector"
    reasoning:
        instructions: |
            ...routing rules...
        actions:
            go_to_returns: @utils.transition to @subagent.returns
                description: "Returns, refunds..."`}</CodeBlock>
      </>
    ),
  },
  {
    id: "subagents",
    title: "subagent",
    body: (
      <>
        <p>
          A focused workflow with its own reasoning instructions, action bindings, and (often)
          inline action definitions. Subagents communicate by transitioning to each other or by
          invoking actions.
        </p>
        <CodeBlock>{`subagent returns:
    label: "Order Returns"
    description: |
        Handles return, refund, exchange...
    before_reasoning:
        if @variables.customer_verified == False:
            transition to @subagent.customer_verification
    reasoning:
        instructions: ->
            | TARGET RETURNS WORKFLOW...
        actions:
            check_eligibility: @actions.Get_Return_Eligibility_By_Item
                with memberId = @variables.member_id
                with orderNumber = @variables.order_number`}</CodeBlock>
        <p>
          The graph view renders <em>before_reasoning</em> and <em>after_reasoning</em>{" "}
          transitions as dashed flow edges between subagents.
        </p>
      </>
    ),
  },
  {
    id: "actions",
    title: "actions",
    body: (
      <>
        <p>
          Actions are typed, callable units backed by Apex (<code>apex://...</code>) or other
          runtime targets. They declare structured <code>inputs</code> and <code>outputs</code>{" "}
          that other parts of the script wire variables into.
        </p>
        <CodeBlock>{`actions:
    Get_Order_Details:
        label: "Get Order Details"
        target: "apex://NF_GetOrderDetailsHandler"
        inputs:
            orderNumber: string
                is_required: True
        outputs:
            isSuccess: boolean
            memberId: string`}</CodeBlock>
      </>
    ),
  },
  {
    id: "modality",
    title: "modality / connection",
    body: (
      <>
        <p>
          Channel configuration — voice settings, telephony adapters, and similar. The graph
          surfaces this on the system node so it&apos;s visible at a glance.
        </p>
        <CodeBlock>{`modality voice:
    voice_id: "UgBBYS2sOqTuMpoF3BR0"
    outbound_speed: 1.0
connection telephony:
    adaptive_response_allowed: True`}</CodeBlock>
      </>
    ),
  },
];

const LINKS: { label: string; href: string }[] = [
  { label: "Salesforce AgentScript guide", href: "https://developer.salesforce.com/docs/ai/agentforce/guide/agent-script.html" },
  { label: "Agentforce labs docs", href: "https://labs.agentforce.com/docs/agent-script" },
  { label: "salesforce/agentscript on GitHub", href: "https://github.com/salesforce/agentscript" },
];

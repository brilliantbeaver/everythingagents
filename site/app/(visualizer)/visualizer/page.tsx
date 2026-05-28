import Link from "next/link";
import { ArrowRight, Upload, Network, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/visualizer/ui/card";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            For Salesforce Agentforce · AgentScript v1
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight">
            Visualize your <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">.agent</span> files as a graph.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Upload an AgentScript file and immediately see the subagents, actions, variables, and
            transitions that drive your agent — laid out as an interactive, navigable graph.
          </p>
          <div className="mt-7 flex gap-3">
            <Link
              href="/visualizer/upload"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
            >
              <Upload className="h-4 w-4" /> Upload an agent
            </Link>
            <Link
              href="/visualizer/docs"
              className="inline-flex h-10 items-center gap-2 rounded-md border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" /> Read the docs
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={Upload}
            title="Drop in any .agent"
            body="Files are parsed in your browser. Nothing is uploaded to a server — the source travels with the URL so links are shareable."
          />
          <FeatureCard
            icon={Network}
            title="Live graph"
            body="Subagents, actions, and variables auto-laid-out with ELK. Pan, zoom, drag, inspect."
          />
          <FeatureCard
            icon={BookOpen}
            title="AgentScript primer"
            body="A built-in reference for the syntax and concepts — system, subagents, variables, modality."
          />
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
            <CardDescription>Three steps to your first visualization.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <Step n={1}>
                Open <Link className="font-medium text-accent underline-offset-4 hover:underline" href="/visualizer/upload">Upload</Link> and pick a <code className="rounded bg-muted px-1.5 py-0.5">.agent</code> file.
              </Step>
              <Step n={2}>
                The file is parsed in your browser and a shareable link is generated. It also lands in the sidebar's <span className="font-medium">Recent</span> list (this browser only).
              </Step>
              <Step n={3}>
                Click any node in the graph to open a detail panel with the source. Copy the URL to share the same view with someone else.
              </Step>
            </ol>
            <div className="mt-5">
              <Link href="/visualizer/upload" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline underline-offset-4">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

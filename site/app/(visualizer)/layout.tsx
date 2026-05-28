import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/site/brand";
import { ThemeToggle } from "@/components/site/theme-toggle";

// The visualizer is a full-bleed tool surface. It opts out of the site's
// centered <main> wrapper by living in a parallel route group that supplies
// its own chrome. A 36px topbar keeps the brand visible and gives users a
// one-click way back to the rest of the site.

export default function VisualizerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="visualizer-scope flex h-screen flex-col bg-background text-foreground">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Link
          href="/"
          aria-label="Back to Everything Agents"
          className="group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
          <BrandMark size={14} />
          <span className="font-medium">Everything Agents</span>
        </Link>
        <span aria-hidden className="h-3 w-px bg-border" />
        <span className="text-xs font-medium text-foreground">Agent Visualizer</span>
        <span className="ml-auto hidden text-[11px] text-muted-foreground md:inline">
          Upload a <code className="rounded bg-muted px-1 font-mono">.agent</code> file to inspect it as a graph.
        </span>
        <div className="ml-auto md:ml-3">
          <ThemeToggle />
        </div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

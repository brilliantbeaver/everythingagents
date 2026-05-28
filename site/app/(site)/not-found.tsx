import Link from "next/link";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 max-w-prose">
      <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
        That page doesn't exist.
      </h1>
      <p className="ui-sans mt-3 text-sm text-muted-foreground">
        The link may be stale, or the topic may have been renamed. A few
        useful jumps:
      </p>
      <ul className="ui-sans mt-6 space-y-2 text-sm">
        <li>
          <Link href="/" className="text-accent underline-offset-2 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/topics" className="text-accent underline-offset-2 hover:underline">
            All topics
          </Link>
        </li>
        <li>
          <Link
            href="/topics/guided-determinism"
            className="text-accent underline-offset-2 hover:underline"
          >
            Guided determinism for agents using AgentScript
          </Link>
        </li>
      </ul>
      <p className="ui-sans mt-8 text-xs text-muted-foreground">
        Tip: press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">⌘K</kbd> to search across all lessons.
      </p>
    </div>
  );
}

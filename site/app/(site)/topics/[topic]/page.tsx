import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic, topics, topicMinutes } from "@/lib/registry";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { NeurosymbolicFrame } from "@/components/illustrations/neurosymbolic-frame";
import { HarnessSixComponents } from "@/components/illustrations/harness-six-components";

type Params = Promise<{ topic: string }>;

export async function generateStaticParams() {
  return topics.filter((t) => t.status === "available").map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { topic } = await params;
  const t = findTopic(topic);
  if (!t) return { title: "Topic" };
  const url = `/topics/${t.slug}`;
  return {
    title: t.shortTitle,
    description: t.oneLine,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: t.title,
      description: t.oneLine,
      url,
    },
  };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { topic: topicSlug } = await params;
  const t = findTopic(topicSlug);
  if (!t) notFound();
  if (t.status !== "available") {
    return (
      <div className="py-8">
        <Breadcrumbs
          crumbs={[
            { href: "/", label: "Home" },
            { href: "/topics", label: "Topics" },
            { label: t.shortTitle },
          ]}
        />
        <h1 className="mt-3 font-serif text-2xl">{t.title}</h1>
        <p className="ui-sans mt-3 text-sm text-muted-foreground">{t.oneLine}</p>
        <p className="ui-sans mt-6 text-sm text-foreground/80">In the queue. Not yet published.</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="ui-sans hidden lg:sticky lg:top-20 lg:block lg:self-start">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {t.shortTitle}
        </p>
        <ol className="mt-2 space-y-0.5 text-sm">
          {t.lessons.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/topics/${t.slug}/${l.slug}`}
                className="flex items-baseline gap-2 rounded px-2 py-1 text-foreground/70 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {l.number}.
                </span>
                <span className="truncate">{l.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </aside>

      <div className="min-w-0">
        <Breadcrumbs
          crumbs={[
            { href: "/", label: "Home" },
            { href: "/topics", label: "Topics" },
            { label: t.shortTitle },
          ]}
        />

        <h1 className="mt-3 font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
          {t.title}
        </h1>
        <p className="ui-sans mt-3 max-w-prose text-base text-foreground/85">{t.oneLine}</p>

        <p
          className="ui-sans mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"
          aria-label="Topic overview"
        >
          <span className="tabular-nums">
            <span className="font-medium text-foreground/80">{t.lessons.length}</span> lessons
          </span>
          <span aria-hidden className="text-muted-foreground/60">·</span>
          <span className="tabular-nums">
            <span className="font-medium text-foreground/80">{topicMinutes(t)}</span> min read
          </span>
        </p>

        {t.slug === "guided-determinism" && (
          <section className="mt-6 max-w-3xl">
            <p className="max-w-prose text-sm leading-relaxed text-foreground/85">
              The pattern this tutorial teaches has a name in the research
              literature: it is a <em>neuro-symbolic</em> agent architecture,
              where a neural decision-maker (the LLM planner) operates inside
              a symbolic scaffold (typed variables, finite-state topic graph,
              {" "}
              <code className="rounded bg-code px-1 py-0.5 font-mono text-[0.85em]">available when</code>
              {" "}
              gates). Lesson 12 traces this lineage in depth; see{" "}
              <Link
                href="/topics/guided-determinism/12-research"
                className="text-accent underline-offset-2 hover:underline"
              >
                Where this fits in AI research
              </Link>
              {" "}
              for the full mapping to Kautz's taxonomy, ReAct-style tool
              use, constrained generation, and the CoALA framing.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
              <NeurosymbolicFrame className="w-full" />
              <p className="ui-sans mt-3 text-xs text-muted-foreground">
                The soft neural choice sits inside hard symbolic gates.
                {" "}
                <Link
                  href="/topics/guided-determinism/12-research"
                  className="text-accent hover:underline"
                >
                  More on the research lineage →
                </Link>
              </p>
            </div>
          </section>
        )}

        {t.slug === "agent-harnesses" && (
          <section className="mt-6 max-w-3xl">
            <p className="max-w-prose text-sm leading-relaxed text-foreground/85">
              An agent harness is the runtime around the model. Strip a
              harness down and you find six concerns: an{" "}
              <strong className="font-semibold">execution loop</strong>,
              a typed{" "}
              <strong className="font-semibold">tool registry</strong>,
              a{" "}
              <strong className="font-semibold">context manager</strong>,
              a{" "}
              <strong className="font-semibold">state store</strong>,
              {" "}
              <strong className="font-semibold">lifecycle hooks</strong>,
              and an{" "}
              <strong className="font-semibold">evaluation interface</strong>.
              Each one is a separate failure mode, each one is a separate
              place to look first when behavior gets weird. The two in
              amber, State and Eval, are the ones the rest of the
              industry systematically underbuilds.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
              <HarnessSixComponents className="w-full" />
              <p className="ui-sans mt-3 text-xs text-muted-foreground">
                The harness wraps the model. The model is opaque; the
                six concerns around it are not.{" "}
                <Link
                  href="/topics/agent-harnesses/02-the-six-components"
                  className="text-accent hover:underline"
                >
                  Open lesson 2 for the full breakdown →
                </Link>
              </p>
            </div>
          </section>
        )}

        {t.prereqs && (
          <aside
            aria-labelledby="before-you-start"
            className="ui-sans mt-8 max-w-prose border-l-2 border-accent/40 pl-4"
          >
            <p
              id="before-you-start"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
            >
              Before you start
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{t.prereqs}</p>
          </aside>
        )}

        <section className="mt-8 max-w-prose">
          <h2 className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Lessons
          </h2>
          <ol className="mt-3 divide-y divide-border border-y border-border">
            {t.lessons.map((l) => (
              <li key={l.slug} className="py-3">
                <Link
                  href={`/topics/${t.slug}/${l.slug}`}
                  className="group block focus-visible:outline-none"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="ui-sans w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {l.number}.
                    </span>
                    <span className="font-serif text-base text-foreground group-hover:text-accent group-focus-visible:underline">
                      {l.title}
                    </span>
                    <span className="ui-sans ml-auto shrink-0 text-xs text-muted-foreground">
                      {l.minutes} min
                    </span>
                  </div>
                  <p className="ui-sans mt-1 pl-9 text-sm text-muted-foreground">{l.keyIdea}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {t.lessons[0] && (
          <div className="ui-sans mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href={`/topics/${t.slug}/${t.lessons[0].slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start with lesson 1
              <span aria-hidden>→</span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {t.lessons[0].title} · {t.lessons[0].minutes} min
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

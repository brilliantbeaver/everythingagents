import Link from "next/link";
import { notFound } from "next/navigation";
import { findTopic, topics, topicMinutes } from "@/lib/registry";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { NeurosymbolicFrame } from "@/components/illustrations/neurosymbolic-frame";

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
          On this topic
        </p>
        <ol className="mt-2 space-y-1 text-sm">
          {t.lessons.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/topics/${t.slug}/${l.slug}`}
                className="flex items-baseline gap-2 rounded px-2 py-1 text-foreground/80 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <p className="ui-sans mt-3 max-w-prose text-sm text-foreground/85">{t.oneLine}</p>

        <dl className="ui-sans mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-baseline gap-1.5">
            <dt className="uppercase tracking-wide">Lessons</dt>
            <dd className="text-foreground/80 tabular-nums">{t.lessons.length}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="uppercase tracking-wide">Time</dt>
            <dd className="text-foreground/80 tabular-nums">{topicMinutes(t)} min</dd>
          </div>
          {t.prereqs && (
            <div className="flex items-baseline gap-1.5">
              <dt className="uppercase tracking-wide">Prereqs</dt>
              <dd className="text-foreground/80">{t.prereqs}</dd>
            </div>
          )}
        </dl>

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
              gates). Lesson 12 traces this lineage in depth — see{" "}
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

        <p className="ui-sans mt-10 max-w-prose text-xs text-muted-foreground">
          The first lesson —{" "}
          <Link
            href={`/topics/${t.slug}/${t.lessons[0]?.slug}`}
            className="text-accent hover:underline"
          >
            {t.lessons[0]?.title}
          </Link>{" "}
          — is the entry point. Everything else builds on it.
        </p>
      </div>
    </div>
  );
}

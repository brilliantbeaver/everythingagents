import Link from "next/link";
import { topics, topicMinutes } from "@/lib/registry";
import { Disclosure } from "@/components/site/disclosure";
import { SpectrumIllustration } from "@/components/illustrations/spectrum";

export default function Home() {
  const available = topics.filter((t) => t.status === "available");
  const upcoming = topics.filter((t) => t.status === "upcoming");

  return (
    <div className="py-10 sm:py-14">
      <section className="max-w-prose">
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          Tutorials for building agents.
        </h1>
        <p className="ui-sans mt-3 text-sm text-muted-foreground">
          Real code, real bugs, real fixes. Starts with Agentforce and grows
          from there. Free to read.
        </p>
      </section>

      <section className="mt-10 max-w-3xl">
        <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          A frame for what's here
        </p>
        <p className="ui-sans mt-2 text-sm text-foreground/85">
          Most agent systems sit somewhere between a chatbot that decides
          everything and a flow that decides nothing. The tutorials here
          live in that middle zone, where guided determinism keeps things
          reliable without going rigid.
        </p>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
          <SpectrumIllustration className="w-full" />
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Tutorials
        </h2>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {available.map((t) => (
            <li key={t.slug} className="py-3">
              <div className="flex items-baseline gap-3">
                <Link
                  href={`/topics/${t.slug}`}
                  className="font-serif text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:underline"
                >
                  {t.title}
                </Link>
                <span className="ui-sans ml-auto shrink-0 text-xs text-muted-foreground">
                  {t.lessons.length} lessons · {topicMinutes(t)} min
                </span>
              </div>
              <p className="ui-sans mt-1 text-sm text-muted-foreground">{t.oneLine}</p>
              <div className="mt-1">
                <Disclosure
                  summary={<span className="text-xs text-muted-foreground">Show lessons</span>}
                >
                  <ol className="ui-sans pb-3 text-sm">
                    {t.lessons.map((l) => (
                      <li key={l.slug} className="flex items-baseline gap-3 py-1">
                        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                          {l.number}.
                        </span>
                        <Link
                          href={`/topics/${t.slug}/${l.slug}`}
                          className="text-foreground/85 hover:text-accent focus-visible:outline-none focus-visible:underline"
                        >
                          {l.title}
                        </Link>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground/80">
                          {l.minutes} min
                        </span>
                      </li>
                    ))}
                  </ol>
                </Disclosure>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {upcoming.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <h2 className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            In the queue
          </h2>
          <ul className="ui-sans mt-3 space-y-1.5 text-sm text-muted-foreground">
            {upcoming.map((t) => (
              <li key={t.slug} className="flex items-baseline gap-3">
                <span className="text-foreground/75">{t.shortTitle}</span>
                <span className="text-xs text-muted-foreground/80">{t.oneLine}</span>
              </li>
            ))}
          </ul>
          <p className="ui-sans mt-4 text-xs text-muted-foreground">
            Sign up in the header to be notified when these go live.
          </p>
        </section>
      )}
    </div>
  );
}

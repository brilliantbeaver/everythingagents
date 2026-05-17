import Link from "next/link";
import { topics, topicMinutes } from "@/lib/registry";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const metadata = {
  title: "Topics",
};

export default function TopicsIndex() {
  return (
    <div className="py-8 sm:py-10">
      <Breadcrumbs crumbs={[{ href: "/", label: "Home" }, { label: "Topics" }]} />

      <h1 className="mt-3 font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
        Topics
      </h1>
      <p className="ui-sans mt-2 text-sm text-muted-foreground">
        Each topic is a sequenced set of lessons around one real agent.
      </p>

      <div className="mt-6 max-w-4xl overflow-x-auto">
        <table className="ui-sans w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Title</th>
              <th className="py-2 pr-4 font-semibold">Lessons</th>
              <th className="py-2 pr-4 font-semibold">Minutes</th>
              <th className="py-2 pr-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topics.map((t) => {
              const isAvail = t.status === "available";
              return (
                <tr key={t.slug} className="align-top">
                  <td className="py-3 pr-4">
                    {isAvail ? (
                      <Link
                        href={`/topics/${t.slug}`}
                        className="font-serif text-base text-foreground hover:text-accent focus-visible:outline-none focus-visible:underline"
                      >
                        {t.title}
                      </Link>
                    ) : (
                      <span className="font-serif text-base text-foreground/60">{t.title}</span>
                    )}
                    <p className="mt-1 max-w-xl text-xs text-muted-foreground">{t.oneLine}</p>
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-foreground/80">
                    {t.lessons.length || "—"}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-foreground/80">
                    {topicMinutes(t) || "—"}
                  </td>
                  <td className="py-3 pr-4 text-xs uppercase tracking-wide">
                    {isAvail ? (
                      <span className="text-accent">available</span>
                    ) : (
                      <span className="text-muted-foreground">{t.status}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

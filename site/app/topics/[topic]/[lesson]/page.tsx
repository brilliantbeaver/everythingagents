import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllTopics, getLesson, type Topic } from "@/lib/content";
import { extractHeadings } from "@/lib/headings";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { mdxComponents } from "@/components/mdx/components";
import { RightTOC } from "@/components/site/right-toc";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};

type Params = Promise<{ topic: string; lesson: string }>;

export async function generateStaticParams() {
  const topics = getAllTopics();
  const params: { topic: string; lesson: string }[] = [];
  for (const t of topics) {
    if (t.status !== "available") continue;
    for (const l of t.lessons) {
      params.push({ topic: t.slug, lesson: l.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { topic, lesson } = await params;
  const found = getLesson(topic, lesson);
  if (!found) return { title: "Lesson" };
  const { topic: t, lesson: l } = found;
  const url = `/topics/${t.slug}/${l.slug}`;
  return {
    title: l.title,
    description: l.keyIdea,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${l.title} · ${t.shortTitle}`,
      description: l.keyIdea,
      url,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: l.title,
      description: l.keyIdea,
    },
  };
}

function LessonNav({ topic }: { topic: Topic }) {
  return (
    <aside className="ui-sans hidden lg:sticky lg:top-20 lg:block lg:self-start">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">On this topic</p>
      <ol className="mt-2 space-y-1 text-sm">
        {topic.lessons.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/topics/${topic.slug}/${l.slug}`}
              className="flex items-baseline gap-2 rounded px-2 py-1 text-foreground/80 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{l.number}.</span>
              <span className="truncate">{l.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export default async function LessonPage({ params }: { params: Params }) {
  const { topic: topicSlug, lesson: lessonSlug } = await params;
  const found = getLesson(topicSlug, lessonSlug);
  if (!found) notFound();
  const { topic, lesson, prev, next } = found;
  const headings = extractHeadings(lesson.source);
  return (
    <div className="py-8 sm:py-10 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_220px]">
      <LessonNav topic={topic} />
      <article className="min-w-0">
        <Breadcrumbs
          crumbs={[
            { href: "/", label: "Home" },
            { href: "/topics", label: "Topics" },
            { href: `/topics/${topic.slug}`, label: topic.shortTitle },
            { label: `${lesson.number}. ${lesson.title}` },
          ]}
        />
        <header className="mt-3 max-w-prose">
          <p className="ui-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Lesson {lesson.number} of {topic.lessons.length} · {lesson.minutes} min
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-base text-foreground/85">{lesson.keyIdea}</p>
        </header>
        <div className="mt-8 max-w-prose">
          <MDXRemote source={lesson.source} components={mdxComponents} options={mdxOptions} />
        </div>
        <nav aria-label="Lesson navigation" className="ui-sans mt-16 flex flex-wrap items-stretch justify-between gap-4 border-t border-border pt-6 text-sm">
          {prev ? (
            <Link href={`/topics/${topic.slug}/${prev.slug}`} className="group flex max-w-[20rem] flex-col rounded-md border border-border px-4 py-3 hover:border-accent/60 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft className="h-3 w-3" aria-hidden />Previous</span>
              <span className="mt-1 font-serif text-base text-foreground group-hover:text-accent">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/topics/${topic.slug}/${next.slug}`} className="group ml-auto flex max-w-[20rem] flex-col items-end rounded-md border border-border px-4 py-3 hover:border-accent/60 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">Next<ChevronRight className="h-3 w-3" aria-hidden /></span>
              <span className="mt-1 font-serif text-base text-foreground group-hover:text-accent">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </article>

      <aside className="hidden xl:sticky xl:top-20 xl:block xl:self-start">
        <RightTOC headings={headings} />
      </aside>
    </div>
  );
}

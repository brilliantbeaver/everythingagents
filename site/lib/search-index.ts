import { getAllTopics } from "@/lib/content";
import { extractHeadings } from "@/lib/headings";

export interface SearchEntry {
  kind: "lesson" | "topic";
  /** Site-relative path to navigate to. */
  href: string;
  /** Topic this entry belongs to (or is). */
  topicSlug: string;
  topicTitle: string;
  /** Lesson-only fields. Empty for topic entries. */
  lessonSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  /** One-line summary shown in result rows. */
  keyIdea: string;
  /** Headings (h2/h3) in the body, used for search ranking. */
  headings: string[];
  /** Stripped prose body for full-text search. */
  body: string;
}

const FENCE_RE = /^(```|~~~)/;

function stripForSearch(source: string): string {
  const lines = source.split("\n");
  const out: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (FENCE_RE.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^\s*<[A-Z]/.test(line) || /^\s*<\//.test(line)) continue;
    if (/^\s*\{`/.test(line) || /^\s*`\}/.test(line)) continue;
    if (/^\s*\|[-:\s|]+\|\s*$/.test(line)) continue;
    out.push(line);
  }

  return out
    .join(" ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(): SearchEntry[] {
  const topics = getAllTopics();
  const entries: SearchEntry[] = [];

  for (const topic of topics) {
    if (topic.status !== "available") continue;

    // Topic landing entry — lets users jump to /topics/<slug> directly.
    entries.push({
      kind: "topic",
      href: `/topics/${topic.slug}`,
      topicSlug: topic.slug,
      topicTitle: topic.shortTitle,
      lessonSlug: "",
      lessonNumber: 0,
      lessonTitle: topic.title,
      keyIdea: topic.oneLine,
      headings: topic.lessons.map((l) => l.title),
      body: `${topic.title} ${topic.oneLine} ${topic.prereqs ?? ""}`.trim(),
    });

    // Lesson entries.
    for (const lesson of topic.lessons) {
      const headings = extractHeadings(lesson.source).map((h) => h.text);
      const body = stripForSearch(lesson.source);
      entries.push({
        kind: "lesson",
        href: `/topics/${topic.slug}/${lesson.slug}`,
        topicSlug: topic.slug,
        topicTitle: topic.shortTitle,
        lessonSlug: lesson.slug,
        lessonNumber: lesson.number,
        lessonTitle: lesson.title,
        keyIdea: lesson.keyIdea,
        headings,
        body,
      });
    }
  }

  return entries;
}

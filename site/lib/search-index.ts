import { getAllTopics } from "@/lib/content";
import { extractHeadings } from "@/lib/headings";

export interface SearchEntry {
  topicSlug: string;
  topicTitle: string;
  lessonSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  keyIdea: string;
  headings: string[];
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
    for (const lesson of topic.lessons) {
      const headings = extractHeadings(lesson.source).map((h) => h.text);
      const body = stripForSearch(lesson.source);
      entries.push({
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

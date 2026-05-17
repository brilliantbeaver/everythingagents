import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface TopicMeta {
  slug: string;
  title: string;
  shortTitle: string;
  oneLine: string;
  prereqs?: string;
  status: "available" | "draft" | "upcoming";
}

export interface LessonFrontmatter {
  title: string;
  keyIdea: string;
  minutes: number;
  number: number;
}

export interface Lesson extends LessonFrontmatter {
  slug: string;
  topicSlug: string;
  source: string;
}

export interface Topic extends TopicMeta {
  lessons: Lesson[];
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "topics");

function readTopicMeta(topicSlug: string): TopicMeta | null {
  const metaPath = path.join(CONTENT_ROOT, topicSlug, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  const raw = fs.readFileSync(metaPath, "utf8");
  return JSON.parse(raw) as TopicMeta;
}

function readLessons(topicSlug: string): Lesson[] {
  const dir = path.join(CONTENT_ROOT, topicSlug);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const lessons: Lesson[] = files.map((file) => {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data as LessonFrontmatter;
    const slug = file.replace(/\.mdx$/, "");
    return {
      ...fm,
      slug,
      topicSlug,
      source: parsed.content,
    };
  });
  lessons.sort((a, b) => a.number - b.number);
  return lessons;
}

export function getAllTopics(): Topic[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const slugs = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const topics: Topic[] = [];
  for (const slug of slugs) {
    const meta = readTopicMeta(slug);
    if (!meta) continue;
    const lessons = readLessons(slug);
    topics.push({ ...meta, lessons });
  }
  return topics;
}

export function getTopic(slug: string): Topic | null {
  const meta = readTopicMeta(slug);
  if (!meta) return null;
  const lessons = readLessons(slug);
  return { ...meta, lessons };
}

export function getLesson(topicSlug: string, lessonSlug: string): { topic: Topic; lesson: Lesson; prev: Lesson | null; next: Lesson | null } | null {
  const topic = getTopic(topicSlug);
  if (!topic) return null;
  const idx = topic.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) return null;
  const lesson = topic.lessons[idx];
  const prev = idx > 0 ? topic.lessons[idx - 1] : null;
  const next = idx < topic.lessons.length - 1 ? topic.lessons[idx + 1] : null;
  return { topic, lesson, prev, next };
}

export function topicMinutes(t: Topic): number {
  return t.lessons.reduce((sum, l) => sum + l.minutes, 0);
}

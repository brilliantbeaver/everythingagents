import type { MetadataRoute } from "next";
import { getAllTopics } from "@/lib/content";

const BASE = "https://everythingagents.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const topics = getAllTopics();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const topicEntries: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${BASE}/topics/${t.slug}`,
    lastModified: now,
    changeFrequency: t.status === "available" ? "monthly" : "yearly",
    priority: t.status === "available" ? 0.8 : 0.4,
  }));

  const lessonEntries: MetadataRoute.Sitemap = topics.flatMap((t) =>
    t.status === "available"
      ? t.lessons.map((l) => ({
          url: `${BASE}/topics/${t.slug}/${l.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : [],
  );

  return [...staticEntries, ...topicEntries, ...lessonEntries];
}

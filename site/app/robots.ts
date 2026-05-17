import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://everythingagents.org/sitemap.xml",
    host: "https://everythingagents.org",
  };
}

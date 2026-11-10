import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

type Entry = { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number };

// Add new pages here. lastModified is the build time: the pages are static and
// rebuilt on every deploy, and file dates are not reliable on Vercel.
const pages: Entry[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/for-students", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-companies", changeFrequency: "monthly", priority: 0.8 },
  { path: "/our-team", changeFrequency: "monthly", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.8 },
  { path: "/datathon", changeFrequency: "monthly", priority: 0.8 },
  { path: "/join-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

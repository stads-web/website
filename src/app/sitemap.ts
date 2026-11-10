import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { teamPeople } from "@/lib/team";

type Entry = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
  /** Site-relative image paths shown on the page (image sitemap). */
  images?: string[];
};

// Portraits on /our-team (board and department leads) plus the team photo.
const teamImages = () => [
  ...teamPeople().flatMap((p) => (p.photo ? [p.photo] : [])),
  "/images/team/team.webp",
];

// Add new pages here. lastModified is the build time: the pages are static and
// rebuilt on every deploy, and file dates are not reliable on Vercel.
const pages = (): Entry[] => [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/for-students", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-companies", changeFrequency: "monthly", priority: 0.8 },
  { path: "/our-team", changeFrequency: "monthly", priority: 0.8, images: teamImages() },
  { path: "/events", changeFrequency: "weekly", priority: 0.8 },
  { path: "/datathon", changeFrequency: "monthly", priority: 0.8 },
  { path: "/join-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages().map(({ path, changeFrequency, priority, images }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
    ...(images ? { images: images.map((src) => `${siteUrl}${src}`) } : {}),
  }));
}

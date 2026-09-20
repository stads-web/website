import type { MetadataRoute } from "next";

// Keep in sync with the `siteUrl` constant in src/app/layout.tsx.
const siteUrl = "https://website-stads1.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

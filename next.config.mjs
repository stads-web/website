// Mirrors src/lib/site.ts (a .mjs config cannot import the TypeScript module).
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.stads.de").replace(/\/$/, "");
const isProduction = process.env.VERCEL_ENV === "production";
const indexable = !process.env.VERCEL_ENV || isProduction;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90, 95],
    // WebP only: AVIF is smaller but far costlier to decode, which shows up as scroll jank.
    formats: ["image/webp"],
    // Photos are only ever replaced under a new name, so let the CDN keep them for a week.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  async redirects() {
    return [
      // Old Webflow URL.
      { source: "/team", destination: "/our-team", permanent: true },
      // Production only: reaching the live site through any *.vercel.app address
      // sends visitors (and search engines) to the real domain. Preview deployments
      // are built with VERCEL_ENV=preview and keep working on their own URLs.
      ...(isProduction
        ? [
            {
              source: "/:path*",
              has: [{ type: "host", value: ".*\\.vercel\\.app" }],
              destination: `${siteUrl}/:path*`,
              permanent: true,
            },
          ]
        : []),
    ];
  },
  // Basic hardening. X-Frame-Options only limits who may embed *our* pages;
  // embeds on our pages (LinkedIn, YouTube iframes) are unaffected.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Preview deployments must never show up in search results.
          ...(indexable ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;

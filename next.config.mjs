/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90, 95],
    // WebP only: AVIF is smaller but far costlier to decode, which shows up as scroll jank.
    formats: ["image/webp"],
    // Photos are only ever replaced under a new name, so let the CDN keep them for a week.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  // Old Webflow URL.
  async redirects() {
    return [{ source: "/team", destination: "/our-team", permanent: true }];
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
        ],
      },
    ];
  },
};

export default nextConfig;

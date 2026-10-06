/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 95],
    // WebP only: AVIF is smaller but far costlier to decode, which shows up as scroll jank.
    formats: ["image/webp"],
    // Photos are only ever replaced under a new name, so let the CDN keep them for a week.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;

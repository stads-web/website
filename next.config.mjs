/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 95],
    // AVIF first: same visual quality at a fraction of the bytes, WebP as fallback.
    formats: ["image/avif", "image/webp"],
    // Photos are only ever replaced under a new name, so let the CDN keep them for a week.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;

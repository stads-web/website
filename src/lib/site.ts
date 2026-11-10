// Canonical site address. The default is the live domain so that every
// deployment (and everyone reading this repo) agrees on it; NEXT_PUBLIC_SITE_URL
// (no trailing slash) can still override it, e.g. for a local test.
// Keep in sync with next.config.mjs, which cannot import this file.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.stads.de").replace(/\/$/, "");

// Only production deployments may be indexed. Vercel preview deployments set
// VERCEL_ENV=preview; local builds have no VERCEL_ENV and count as indexable.
export const indexable = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

// Shared OG/Twitter base values; pages spread these so they don't lose them
// when they override `openGraph` / `twitter` (Next merges metadata shallowly).
export const ogBase = {
  siteName: "STADS",
  locale: "en_US",
  type: "website",
} as const;

export const twitterBase = { card: "summary_large_image" } as const;

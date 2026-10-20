export const siteUrl = "https://website-stads1.vercel.app";

// Shared OG/Twitter base values; pages spread these so they don't lose them
// when they override `openGraph` / `twitter` (Next merges metadata shallowly).
export const ogBase = {
  siteName: "STADS",
  locale: "en_US",
  type: "website",
} as const;

export const twitterBase = { card: "summary_large_image" } as const;

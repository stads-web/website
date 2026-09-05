# STADS Website

Next.js site for STADS – Students' Association for Data Analytics & Statistics Mannheim e.V.

## Editing content (no coding needed)

All page copy lives in `.md` files under `content/`, editable directly on GitHub
(open the file → pencil icon → edit → commit). No local setup required for text changes:

- `content/home/` – homepage sections (hero, stats, program, testimonials, ...)
- `content/global/site.md` – navigation, footer links, social media URLs
- `content/legal/` – Impressum & Datenschutzerklärung

Each file has a block at the top between `---` lines (the "frontmatter") with
structured fields like titles, stats, or links, and below that any longer body
text. Keep the field names and `---` markers as they are; only change the values.

Photos live in `public/images/` as `.webp` files, referenced by path from the
content files (e.g. `/images/python_course.webp`).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Analytics

Two layers, both free:

- **Vercel Web Analytics** (`<Analytics />` in `src/app/layout.tsx`) - cookie-less,
  no consent needed. Enable it once for the project in the Vercel dashboard under
  the "Analytics" tab.
- **Google Analytics 4 + Microsoft Clarity** - gated behind the cookie consent
  banner (`src/lib/consent.tsx`, `src/components/ConsentBanner.tsx`), only load
  after a visitor clicks "Accept all". Copy `.env.example` to `.env.local` to
  enable them locally; in production set `NEXT_PUBLIC_GA_ID` and
  `NEXT_PUBLIC_CLARITY_ID` in Vercel → Project Settings → Environment Variables.
  Both are free (GA4 forever, Clarity forever). Without the env vars the site
  works fine - the scripts just never load.

## Deployment

Pushing to `main` deploys automatically via Vercel.

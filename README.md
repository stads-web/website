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

## Environment variables

Copy `.env.example` to `.env.local` to enable Google Analytics / Microsoft
Clarity locally. In production these are set in Vercel → Project Settings →
Environment Variables. Analytics only load after a visitor accepts the cookie
banner (see `src/lib/consent.tsx`).

## Deployment

Pushing to `main` deploys automatically via Vercel.

import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const title = "Impressum – STADS";
const description =
  "Legal notice (Impressum) for STADS - Students' Association for Data Analytics & Statistics Mannheim e.V., including contact and registration details.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/impressum" },
  openGraph: {
    ...ogBase,
    title,
    description,
    url: "/impressum",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { ...twitterBase, title, description },
};

export default function ImpressumPage() {
  const { data, content } = readContent<{ title: string }>(
    "legal/impressum.md"
  );
  return <LegalPage title={data.title} markdownBody={content} />;
}

import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const title = "Datenschutzerklärung – STADS";
const description =
  "Privacy policy of STADS - Students' Association for Data Analytics & Statistics Mannheim e.V. - how this website handles your personal data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    ...ogBase,
    title,
    description,
    url: "/datenschutz",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { ...twitterBase, title, description },
};

export default function DatenschutzPage() {
  const { data, content } = readContent<{ title: string }>(
    "legal/datenschutz.md"
  );
  return <LegalPage title={data.title} markdownBody={content} />;
}

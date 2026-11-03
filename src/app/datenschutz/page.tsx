import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const title = "Datenschutzerklärung – STADS Mannheim e.V.";
const description =
  "Datenschutzerklärung der STADS Mannheim e.V.: wie diese Website personenbezogene Daten verarbeitet (Hosting, Analytics, Kontaktformular) und Ihre Rechte.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    ...ogBase,
    locale: "de_DE",
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

import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

const title = "Impressum – STADS Mannheim e.V.";
const description =
  "Impressum der STADS – Students' Association for Data Analytics & Statistics Mannheim e.V.: Anschrift, Vorstand, Registereintrag und Kontakt.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/impressum" },
  openGraph: {
    ...ogBase,
    locale: "de_DE",
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

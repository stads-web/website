import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Impressum – STADS" };

export default function ImpressumPage() {
  const { data, content } = readContent<{ title: string }>(
    "legal/impressum.md"
  );
  return <LegalPage title={data.title} markdownBody={content} />;
}

import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Datenschutzerklärung – STADS" };

export default function DatenschutzPage() {
  const { data, content } = readContent<{ title: string }>(
    "legal/datenschutz.md"
  );
  return <LegalPage title={data.title} markdownBody={content} />;
}

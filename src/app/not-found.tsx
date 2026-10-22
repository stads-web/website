import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";
import PageTopFade from "@/components/PageTopFade";
import { ogBase, twitterBase } from "@/lib/site";

const title = "Page not found – STADS";
const description = "This page doesn't exist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: null },
  openGraph: { ...ogBase, title, description },
  twitter: { ...twitterBase, title, description },
};

export default function NotFound() {
  return (
    <main>
      <PageTopFade />
      <div className="mx-auto flex max-w-content flex-col items-center px-4 pb-24 pt-4 text-center sm:px-6 sm:pb-32">
        <NotFoundContent />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found – STADS",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <NotFoundContent />
    </main>
  );
}

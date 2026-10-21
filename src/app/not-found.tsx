import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found – STADS",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-content flex-col items-center px-4 pb-24 pt-[calc(6rem+env(safe-area-inset-top,0px))] text-center sm:px-6 sm:py-32">
      <NotFoundContent />
    </main>
  );
}

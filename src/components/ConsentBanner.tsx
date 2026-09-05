"use client";

import Link from "next/link";
import { useConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const { bannerOpen, acceptAll, reject } = useConsent();

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-heading"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-100 bg-white/95 px-4 py-5 shadow-[0_-8px_24px_rgba(15,29,54,0.12)] backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-content flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p id="cookie-consent-heading" className="font-semibold text-brand-900">
            We&apos;d like to understand how you use our site
          </p>
          <p className="mt-1 text-sm text-brand-900/70">
            With your consent, we use analytics cookies (Google Analytics,
            Microsoft Clarity) to see which pages visitors and partner
            companies find most useful, so we can keep improving STADS.de.
            You can change your mind anytime via &quot;Cookie
            settings&quot; in the footer. See our{" "}
            <Link href="/datenschutz" className="underline underline-offset-2">
              privacy policy
            </Link>{" "}
            for details.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={reject}
            className="cursor-pointer rounded-full border border-brand-300 px-5 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="cursor-pointer rounded-full bg-brand-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-900"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

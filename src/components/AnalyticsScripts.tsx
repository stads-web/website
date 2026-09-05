"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Renders GA4 + Microsoft Clarity only after the visitor has accepted
 * analytics cookies via ConsentBanner - nothing loads before that (see
 * datenschutz.md §4-6). Missing env vars just mean "not configured yet",
 * not an error.
 */
export default function AnalyticsScripts() {
  const { choice } = useConsent();

  if (choice !== "accepted") return null;

  return (
    <>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      {CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}

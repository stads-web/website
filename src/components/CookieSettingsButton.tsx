"use client";

import { useConsent } from "@/lib/consent";

export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie settings
    </button>
  );
}

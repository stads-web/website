"use client";

import PartnerLogo, {
  partnerLinkProps,
  partnerLinkClass,
} from "../PartnerLogo";
import type { Partner } from "@/lib/types";

/**
 * Endless band of partner logos. Drifts on its own at a constant speed,
 * independent of page scroll.
 */
export default function LogoMarquee({
  logos,
  className = "",
}: {
  logos: Partner[];
  className?: string;
}) {
  const run = [...logos, ...logos, ...logos];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max">
        <div className="animate-marquee flex w-max items-center">
          {run.concat(run).map((logo, i) => {
            const first = i < logos.length; // only the first copy is focusable / announced
            const Tag = logo.href ? "a" : "span";
            return (
              <Tag
                key={`${logo.name}-${i}`}
                {...partnerLinkProps(logo, !first)}
                {...(first ? {} : { "aria-hidden": true })}
                className={`${logo.href ? partnerLinkClass + " " : ""}mx-3 flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-brand-800 px-5 [--logo-u:2.3rem] sm:mx-4 sm:h-28 sm:w-60 sm:rounded-3xl sm:px-7 sm:[--logo-u:3rem]`}
              >
                <PartnerLogo partner={logo} />
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
}

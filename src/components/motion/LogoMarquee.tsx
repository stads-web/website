"use client";

import Image from "next/image";
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
          {run.concat(run).map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              // Reversed logos need the blue box; colour logos need a light one.
              className={`mx-4 flex h-16 w-40 shrink-0 items-center justify-center rounded-2xl border-[0.5px] px-6 sm:mx-5 sm:h-[72px] sm:w-48 ${
                logo.box === "blue"
                  ? "border-white/50 bg-brand-500"
                  : "border-brand-200 bg-white"
              }`}
            >
              <Image
                src={logo.logo}
                alt={logo.name}
                width={160}
                height={48}
                className="h-auto max-h-7 w-auto max-w-full object-contain"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

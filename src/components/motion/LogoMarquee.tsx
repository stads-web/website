"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Partner } from "@/lib/types";

/**
 * Endless band of partner logos. Drifts on its own and gets nudged further
 * along by scroll, so the strip never reads as a static row.
 */
export default function LogoMarquee({
  logos,
  className = "",
}: {
  logos: Partner[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-10%"]);

  const run = [...logos, ...logos, ...logos];

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="flex w-max">
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
      </motion.div>
    </div>
  );
}

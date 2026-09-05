"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * A kinetic band of repeating words. Drifts on its own and gets nudged
 * further along by scroll, so it never feels like a static ribbon.
 */
export default function Marquee({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-14%"]);

  const line = [...words, ...words, ...words];

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="flex w-max">
        <div className="animate-marquee flex w-max items-center">
          {line.concat(line).map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center">
              <span className="whitespace-nowrap px-6 text-4xl font-medium tracking-tight sm:text-6xl">
                {word}
              </span>
              <span className="text-2xl opacity-40">&middot;</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

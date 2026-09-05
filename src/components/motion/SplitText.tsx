"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { delayChildren: delay, staggerChildren: 0.055 },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

/**
 * Reveals a line word by word: each word rises and unblurs in sequence.
 * A single viewport trigger on the whole line drives every word's variant,
 * which is what makes short words reliable - per-word viewport triggers on
 * tiny inline elements can silently fail to fire in some browsers.
 */
export default function SplitText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      custom={delay}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}

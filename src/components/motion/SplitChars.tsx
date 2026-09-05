"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.19, 1, 0.22, 1] as const;

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { delayChildren: delay, staggerChildren: 0.045 },
  }),
};

const char: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

/** Display-type reveal: every letter wipes up from behind its own mask. */
export default function SplitChars({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      custom={delay}
      aria-label={text}
    >
      {text.split("").map((c, i) => (
        <span
          key={`${c}-${i}`}
          aria-hidden
          className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom"
        >
          <motion.span className="inline-block" variants={char}>
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

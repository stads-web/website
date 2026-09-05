"use client";

import { motion } from "framer-motion";
import SplitText from "./SplitText";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The display heading used across the site: a tracked eyebrow over a rule that
 * draws itself, then the title revealed word by word at display scale.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const centered = align === "center";
  const onLight = tone === "dark";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <div
          className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className={`hidden h-px w-10 origin-left sm:block ${
              onLight ? "bg-brand-400" : "bg-white/40"
            }`}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className={`font-mono text-[11px] uppercase tracking-[0.32em] ${
              onLight ? "text-brand-500" : "text-brand-300"
            }`}
          >
            {eyebrow}
          </motion.p>
        </div>
      )}

      <h2
        className={`${eyebrow ? "mt-5" : ""} text-balance text-4xl font-medium tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[72px] lg:leading-[0.98] ${
          onLight ? "text-brand-900" : "text-white"
        }`}
      >
        <SplitText text={title} />
        {accent && (
          <>
            {" "}
            <SplitText
              text={accent}
              delay={0.18}
              className={onLight ? "text-brand-500" : "text-brand-300"}
            />
          </>
        )}
      </h2>

      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className={`mt-6 max-w-xl text-lg leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${onLight ? "text-brand-900/70" : "text-white/65"}`}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}

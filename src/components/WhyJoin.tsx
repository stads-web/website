"use client";

import { motion } from "framer-motion";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import { iconMap } from "@/lib/icons";
import type { Icon } from "@phosphor-icons/react/lib";
import type { WhyJoinData, WhyJoinItem } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Real Phosphor "thin" outlines for the two items whose icon reads as one
 * clean continuous line - these get a literal self-drawing stroke that then
 * solidifies into the normal filled glyph. Copied verbatim from
 * @phosphor-icons/react's thin-weight defs so the resting state always
 * matches the library's own icon exactly.
 */
const DRAW_PATHS: Record<string, string> = {
  "rocket-launch":
    "M219.86,47.36a12,12,0,0,0-11.22-11.22c-12-.71-42.82.38-68.35,25.91L134.35,68h-60a11.9,11.9,0,0,0-8.48,3.52L31.52,105.85a12,12,0,0,0,6.81,20.37l39.79,5.55,46.11,46.11,5.55,39.81a12,12,0,0,0,20.37,6.79l34.34-34.35a11.9,11.9,0,0,0,3.52-8.48v-60l5.94-5.94C219.48,90.18,220.57,59.41,219.86,47.36ZM36.21,115.6a3.94,3.94,0,0,1,1-4.09L71.53,77.17A4,4,0,0,1,74.35,76h52L78.58,123.76,39.44,118.3A3.94,3.94,0,0,1,36.21,115.6ZM180,181.65a4,4,0,0,1-1.17,2.83l-34.35,34.34a4,4,0,0,1-6.79-2.25l-5.46-39.15L180,129.65Zm-52-11.31L85.66,128l60.28-60.29c23.24-23.24,51.25-24.23,62.22-23.58a3.93,3.93,0,0,1,3.71,3.71c.65,11-.35,39-23.58,62.22ZM98.21,189.48C94,198.66,80,220,40,220a4,4,0,0,1-4-4c0-40,21.34-54,30.52-58.21a4,4,0,0,1,3.32,7.28c-7.46,3.41-24.43,14.66-25.76,46.85,32.19-1.33,43.44-18.3,46.85-25.76a4,4,0,1,1,7.28,3.32Z",
  "chart-line-up":
    "M228,208a4,4,0,0,1-4,4H32a4,4,0,0,1-4-4V48a4,4,0,0,1,8,0V166.34l57.17-57.17a4,4,0,0,1,5.66,0L128,138.34,190.34,76H160a4,4,0,0,1,0-8h40a4,4,0,0,1,4,4v40a4,4,0,0,1-8,0V81.66l-65.17,65.17a4,4,0,0,1-5.66,0L96,117.66l-60,60V204H224A4,4,0,0,1,228,208Z",
};

/** Sketches the icon's outline in, then dissolves it into the solid glyph. */
function DrawIcon({ path, delay }: { path: string; delay: number }) {
  return (
    <svg viewBox="0 0 256 256" className="h-7 w-7" aria-hidden="true">
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 1 }}
        whileInView={{ pathLength: 1, opacity: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          pathLength: { duration: 1.05, ease: EASE, delay },
          opacity: { duration: 0.4, delay: delay + 0.85 },
        }}
      />
      <motion.path
        d={path}
        fill="currentColor"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: EASE, delay: delay + 0.75 }}
      />
    </svg>
  );
}

/** Tasteful fallback for icons whose shape doesn't read cleanly as a single line. */
function SpringIcon({
  IconComponent,
  delay,
}: {
  IconComponent: Icon;
  delay: number;
}) {
  return (
    <motion.span
      className="flex"
      initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 220, damping: 15, delay }}
    >
      <IconComponent size={28} weight="regular" aria-hidden="true" />
    </motion.span>
  );
}

function ReasonCard({ item, index }: { item: WhyJoinItem; index: number }) {
  const drawPath = DRAW_PATHS[item.icon];
  const IconComponent = iconMap[item.icon];
  const cardDelay = 0.08 * index;
  const iconDelay = cardDelay + 0.15;

  return (
    <Reveal delay={cardDelay}>
      <div className="group h-full rounded-[28px] border border-brand-100 bg-brand-50/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-card sm:p-8">
        <div className="flex items-start justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-800 ring-1 ring-inset ring-brand-100 transition-colors duration-500 group-hover:ring-brand-300">
            {drawPath ? (
              <DrawIcon path={drawPath} delay={iconDelay} />
            ) : IconComponent ? (
              <SpringIcon IconComponent={IconComponent} delay={iconDelay} />
            ) : null}
          </span>
          <span className="font-accent text-3xl italic leading-none text-brand-200">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-6 text-lg font-medium text-brand-900">{item.heading}</p>
        <p className="mt-2 text-base leading-relaxed text-brand-900/70">
          {item.text}
        </p>
      </div>
    </Reveal>
  );
}

export default function WhyJoin({ data }: { data: WhyJoinData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="max-w-3xl text-balance text-3xl font-medium sm:text-4xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.title} className="text-brand-900" />{" "}
        <SplitText
          text={data.subtitle}
          delay={0.2}
          className="text-brand-400/50"
        />
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {data.items.map((item, i) => (
          <ReasonCard key={item.heading} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

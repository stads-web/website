"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "../motion/Reveal";
import { iconMap } from "@/lib/icons";
import type { EventFormat } from "@/lib/types";

function TimelineItem({ item, index }: { item: EventFormat; index: number }) {
  const Icon = iconMap[item.icon];
  const left = index % 2 === 0;

  return (
    <div className="relative flex items-start gap-6 sm:gap-0">
      <div className="absolute left-[19px] top-1 z-10 sm:left-1/2 sm:-translate-x-1/2">
        <Reveal delay={0.1}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-brand-500 text-white shadow-card">
            {Icon && <Icon size={18} weight="bold" aria-hidden="true" />}
          </span>
        </Reveal>
      </div>

      <div className="w-10 shrink-0 sm:hidden" />

      <div
        className={`flex-1 pb-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:pb-24 ${
          left ? "" : "sm:[&>*:first-child]:col-start-2"
        }`}
      >
        <Reveal className={left ? "sm:text-right" : "sm:col-start-1 sm:row-start-1"}>
          <div className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.08)] sm:p-7">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-500">
              {item.cadence}
            </span>
            <p className="mt-3 text-xl font-medium text-brand-900">{item.name}</p>
            <p className="mt-2 leading-relaxed text-brand-900/70">{item.text}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function Timeline({ items }: { items: EventFormat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });
  const clampedScale = useTransform(scaleY, (v) => Math.min(1, Math.max(0, v)));

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[19px] top-0 h-full w-px bg-brand-100 sm:left-1/2" />
      <motion.div
        style={{ scaleY: clampedScale }}
        className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-brand-500 to-brand-800 sm:left-1/2"
      />

      <div className="relative">
        {items.map((item, i) => (
          <TimelineItem key={item.name} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

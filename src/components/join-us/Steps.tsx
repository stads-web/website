"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import type { JoinStepsData } from "@/lib/types";

export default function Steps({ data }: { data: JoinStepsData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.5"],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const scaleY = useTransform(spring, (v) => Math.min(1, Math.max(0, v)));

  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <h2 className="text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
        <SplitText text={data.title} />
      </h2>

      <div ref={ref} className="relative mt-16 max-w-2xl">
        <div className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-px bg-brand-100" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-brand-500 to-brand-800"
        />

        <div className="flex flex-col gap-12">
          {data.steps.map((step, i) => (
            <Reveal key={step.title} delay={0.1 * i}>
              <div className="relative flex gap-6 pl-0">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-xl font-medium text-brand-900 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.08)] ring-4 ring-white">
                  {i + 1}
                </span>
                <div className="pt-2">
                  <p className="text-lg font-medium text-brand-900">{step.title}</p>
                  <p className="mt-2 max-w-md leading-relaxed text-brand-900/70">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

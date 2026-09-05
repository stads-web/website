"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import DataCanvas from "./DataCanvas";
import type { WeekendBeat, WeekendData } from "@/lib/types";

function Beat({
  beat,
  index,
  total,
  progress,
}: {
  beat: WeekendBeat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const fade = (end - start) * 0.32;
  const first = index === 0;
  const last = index === total - 1;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [first ? 1 : 0, 1, 1, last ? 1 : 0]
  );
  const y = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [first ? 0 : 48, 0, 0, last ? 0 : -48]
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex items-center">
      <div className="max-w-lg">
        <p className="font-mono text-xs tracking-[0.35em] text-brand-300">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <p className="mt-5 text-4xl font-medium leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          {beat.label}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-white/65">{beat.text}</p>
      </div>
    </motion.div>
  );
}

export default function Weekend({ data }: { data: WeekendData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinned(query.matches && !reduced.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [pinned]);

  return (
    <section className="relative bg-brand-950">
      {/* The ref stays mounted in both layouts so scroll tracking has a target. */}
      <div
        ref={ref}
        className="relative"
        style={pinned ? { height: `${data.beats.length * 100}vh` } : undefined}
      >
        {!pinned && (
          <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
                {data.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-medium text-white sm:text-4xl">
                {data.title}
              </h2>
            </Reveal>

            <div className="relative mt-10 h-64 overflow-hidden rounded-[28px] border border-white/10">
              <DataCanvas progress={scrollYProgress} className="h-full w-full" />
            </div>

            <div className="mt-12 flex flex-col gap-12">
              {data.beats.map((beat, i) => (
                <Reveal key={beat.label} delay={0.05 * i}>
                  <p className="font-mono text-xs tracking-[0.35em] text-brand-300">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(data.beats.length).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-3xl font-medium text-white">{beat.label}</p>
                  <p className="mt-3 leading-relaxed text-white/65">{beat.text}</p>
                </Reveal>
              ))}
            </div>

            <p className="mt-16 text-xl text-white/50">{data.outro}</p>
          </div>
        )}

        {pinned && (
          <div className="sticky top-0 h-screen overflow-hidden">
            <DataCanvas
              progress={scrollYProgress}
              className="absolute inset-0 h-full w-full"
            />
            {/* Shields the type without dimming the cloud on the open side. */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950 from-15% via-brand-950/70 via-50% to-transparent" />

            <div className="relative mx-auto flex h-full max-w-content flex-col px-4 pb-12 pt-28 sm:px-6">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
                  {data.eyebrow}
                </p>
                <p className="text-sm text-white/40">{data.title}</p>
              </div>

              <div className="relative flex-1">
                {data.beats.map((beat, i) => (
                  <Beat
                    key={beat.label}
                    beat={beat}
                    index={i}
                    total={data.beats.length}
                    progress={scrollYProgress}
                  />
                ))}
              </div>

              <div className="h-px w-full bg-white/15">
                <motion.div
                  style={{ scaleX: scrollYProgress }}
                  className="h-px origin-left bg-gradient-to-r from-brand-400 to-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {pinned && (
        <div className="mx-auto max-w-content px-4 pb-24 sm:px-6">
          <Reveal>
            <p className="max-w-xl text-2xl font-medium text-white/60 sm:text-3xl">
              <SplitText text={data.outro} />
            </p>
          </Reveal>
        </div>
      )}
    </section>
  );
}

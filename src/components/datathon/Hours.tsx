"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import type { HourBeat, HoursData } from "@/lib/types";

const TOTAL_MINUTES = 48 * 60;

function formatClock(progress: number) {
  const remaining = Math.max(0, TOTAL_MINUTES * (1 - progress));
  const hours = Math.floor(remaining / 60);
  // Quantised so the digits tick instead of blurring through every value.
  const minutes = Math.floor((remaining % 60) / 5) * 5;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** One cross-fading beat inside the pinned stage. */
function Beat({
  beat,
  index,
  total,
  progress,
}: {
  beat: HourBeat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const fade = (end - start) * 0.3;

  const first = index === 0;
  const last = index === total - 1;

  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [first ? 1 : 0, 1, 1, last ? 1 : 0]
  );
  const scale = useTransform(progress, [start, end], [1.1, 1]);
  const textY = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [first ? 0 : 40, 0, 0, last ? 0 : -40]
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <div className="mx-auto grid h-full max-w-content grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div style={{ y: textY }} className="order-2 lg:order-1">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-300">
            {beat.time}
          </p>
          <p className="mt-4 text-3xl font-medium text-white sm:text-4xl lg:text-5xl">
            {beat.title}
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            {beat.text}
          </p>
        </motion.div>

        <div className="order-1 overflow-hidden rounded-[36px] border border-white/10 lg:order-2">
          <motion.div style={{ scale }} className="relative aspect-[4/3] w-full">
            <Image
              src={beat.image}
              alt={beat.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StackedBeats({ data }: { data: HoursData }) {
  return (
    <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
          {data.eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-medium text-white sm:text-5xl">
          {data.title}
        </h2>
      </Reveal>

      <div className="mt-12 flex flex-col gap-14">
        {data.beats.map((beat, i) => (
          <Reveal key={beat.time} delay={0.06 * i}>
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={beat.image}
                  alt={beat.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-5 font-mono text-sm tracking-[0.3em] text-brand-300">
              {beat.time}
            </p>
            <p className="mt-2 text-2xl font-medium text-white">{beat.title}</p>
            <p className="mt-2 leading-relaxed text-white/70">{beat.text}</p>
          </Reveal>
        ))}
      </div>

      <p className="mt-16 text-xl text-white/60">{data.outro}</p>
    </div>
  );
}

export default function Hours({ data }: { data: HoursData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [clock, setClock] = useState("48:00");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = formatClock(value);
    setClock((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinned(query.matches && !reduced.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!pinned) {
    return (
      <section className="bg-brand-950">
        <StackedBeats data={data} />
      </section>
    );
  }

  return (
    <section className="bg-brand-950">
      <div
        ref={ref}
        className="relative"
        style={{ height: `${data.beats.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="mx-auto flex w-full max-w-content items-baseline justify-between px-4 pt-28 sm:px-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
                {data.eyebrow}
              </p>
              <p className="mt-2 text-2xl font-medium text-white">{data.title}</p>
            </div>
            <p className="font-mono text-5xl tabular-nums tracking-tight text-white/90 sm:text-6xl">
              {clock}
            </p>
          </div>

          <div className="relative flex-1">
            {data.beats.map((beat, i) => (
              <Beat
                key={beat.time}
                beat={beat}
                index={i}
                total={data.beats.length}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-content px-4 pb-10 sm:px-6">
            <div className="h-px w-full bg-white/15">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-px origin-left bg-gradient-to-r from-brand-400 to-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 pb-24 sm:px-6">
        <Reveal>
          <p className="max-w-xl text-2xl font-medium text-white/70 sm:text-3xl">
            <SplitText text={data.outro} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

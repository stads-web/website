"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import DataCanvas from "./DataCanvas";
import type { WeekendBeat, WeekendData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

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

/**
 * Non-pinned layout's beat card: a one-time whileInView fade/slide (same
 * language as `Reveal`) plus an `onViewportEnter` step trigger that drives
 * the companion canvas and the rail below - discrete per-step activation
 * instead of scrubbing continuously with raw scroll position, which is what
 * fights momentum scrolling on touch.
 */
function MobileBeat({
  beat,
  index,
  total,
  active,
  onActive,
}: {
  beat: WeekendBeat;
  index: number;
  total: number;
  active: boolean;
  onActive: (index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      onViewportEnter={() => onActive(index)}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: EASE }}
      className="relative pl-9"
    >
      <span
        aria-hidden
        className={`absolute left-0 top-1.5 h-2 w-2 rounded-full transition-all duration-500 ${
          active ? "scale-125 bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.5)]" : "bg-white/25"
        }`}
      />
      <p className="font-mono text-xs tracking-[0.35em] text-brand-300">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <p
        className={`mt-3 text-3xl font-medium transition-colors duration-500 ${
          active ? "text-white" : "text-white/70"
        }`}
      >
        {beat.label}
      </p>
      <p className="mt-3 leading-relaxed text-white/65">{beat.text}</p>
    </motion.div>
  );
}

export default function Weekend({ data }: { data: WeekendData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Drives the mobile canvas + rail: a spring toward the active beat's
  // fraction, so the visual settles into each step instead of tracking raw
  // scroll position (which is what read as "stuck" on touch/momentum scroll).
  const activeBeatTarget = useMotionValue(0);
  const mobileProgress = useSpring(
    useTransform(activeBeatTarget, (v) => v / Math.max(1, data.beats.length - 1)),
    { stiffness: 90, damping: 22, mass: 0.6 }
  );

  useEffect(() => {
    activeBeatTarget.set(activeBeat);
  }, [activeBeat, activeBeatTarget]);

  useEffect(() => {
    // The pinned scrollytelling only makes sense with a real pointer: touch
    // scrolling's momentum and dynamic viewport (Safari's collapsing address
    // bar) fight `position: sticky`, which reads as the section "getting
    // stuck" rather than the intended pin. Gate on the same capability check
    // DataCanvas already uses for its WebGL fast path, not just width alone -
    // a touch tablet at a desktop-class width must not get pinned either.
    const widthQuery = window.matchMedia("(min-width: 1024px)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setPinned(widthQuery.matches && pointerQuery.matches && !reducedQuery.matches);
    update();
    widthQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);
    return () => {
      widthQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
    };
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

            <div className="relative mt-10">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[40px] bg-brand-500/10 blur-2xl"
              />
              <div className="relative h-64 overflow-hidden rounded-[28px] border border-white/10">
                <DataCanvas progress={mobileProgress} className="h-full w-full" />
              </div>
            </div>

            <div className="relative mt-12">
              <div aria-hidden className="absolute left-1 top-2 bottom-2 w-px bg-white/10" />
              <motion.div
                aria-hidden
                style={{ scaleY: mobileProgress }}
                className="absolute left-1 top-2 w-px origin-top bg-gradient-to-b from-brand-300 to-white"
              />
              <div className="flex flex-col gap-12">
                {data.beats.map((beat, i) => (
                  <MobileBeat
                    key={beat.label}
                    beat={beat}
                    index={i}
                    total={data.beats.length}
                    active={i === activeBeat}
                    onActive={setActiveBeat}
                  />
                ))}
              </div>
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

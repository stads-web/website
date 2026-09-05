"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import Spotlight from "../motion/Spotlight";
import type { Edition, HistoryData } from "@/lib/types";

function EditionCard({ edition, index }: { edition: Edition; index: number }) {
  return (
    <article className="group relative flex h-full w-[86vw] shrink-0 flex-col overflow-hidden rounded-[36px] border border-brand-100 bg-white p-8 shadow-[0px_15px_30px_rgba(15,29,54,0.05),0px_30px_60px_rgba(15,29,54,0.08)] sm:w-[520px]">
      <Spotlight />

      <div className="relative flex items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-500">
          {edition.period}
        </p>
        <span className="font-mono text-xs text-brand-300">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="relative mt-4 text-3xl font-medium text-brand-900">
        {edition.name}
      </h3>

      {edition.metric && (
        <p className="relative mt-5 flex items-baseline gap-3">
          <span className="text-5xl font-medium tracking-tight text-brand-800">
            {edition.metric}
          </span>
          <span className="text-sm uppercase tracking-[0.16em] text-brand-500">
            {edition.metricLabel}
          </span>
        </p>
      )}

      <p className="relative mt-5 leading-relaxed text-brand-900/70">
        {edition.text}
      </p>

      {edition.partners.length > 0 && (
        <div className="relative mt-auto flex flex-wrap gap-2 border-t border-brand-100 pt-6">
          {edition.partners.map((partner) => (
            <span
              key={partner}
              className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800"
            >
              {partner}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function History({ data }: { data: HistoryData }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [pinned, setPinned] = useState(false);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const x = useSpring(rawX, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const active = query.matches && !reduced.matches;
      setPinned(active);
      const track = trackRef.current;
      if (!active || !track) {
        setTravel(0);
        return;
      }
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 64));
    };

    measure();
    query.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      query.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The track only exists once pinned, so measure again after that render lands.
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;
    setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 64));
    window.dispatchEvent(new Event("resize"));
  }, [pinned]);

  return (
    <section id="history" className="pt-20 sm:pt-24">
      <div className="mx-auto w-full max-w-content px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-500">
          {data.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px] md:leading-[1.1]">
          <SplitText text={data.title} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-xl leading-relaxed text-brand-900/70">
            {data.intro}
          </p>
        </Reveal>
      </div>

      {/* Kept mounted in both layouts so scroll tracking always has a target. */}
      <div
        ref={outerRef}
        className="relative"
        style={pinned ? { height: `calc(100vh + ${travel}px)` } : undefined}
      >
        {!pinned && (
          <div className="mx-auto mt-12 flex max-w-content flex-col gap-6 px-4 pb-20 sm:px-6">
            {data.editions.map((edition, i) => (
              <Reveal key={edition.period} delay={0.05 * i}>
                <div className="[&>article]:w-full">
                  <EditionCard edition={edition} index={i} />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {pinned && (
          <div className="sticky top-0 flex h-screen flex-col overflow-hidden pb-10 pt-24">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex min-h-0 flex-1 items-stretch gap-6 px-4 sm:px-6"
            >
              {data.editions.map((edition, i) => (
                <EditionCard key={edition.period} edition={edition} index={i} />
              ))}
            </motion.div>

            <div className="mx-auto mt-8 w-full max-w-content px-4 sm:px-6">
              <div className="h-px w-full bg-brand-100">
                <motion.div
                  style={{ scaleX: scrollYProgress }}
                  className="h-px origin-left bg-gradient-to-r from-brand-500 to-brand-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

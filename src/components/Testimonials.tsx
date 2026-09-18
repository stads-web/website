"use client";

import { Quotes } from "@phosphor-icons/react/dist/ssr";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import Spotlight from "./motion/Spotlight";
import type { Testimonial, TestimonialsData } from "@/lib/types";

/** "Anna M." -> "AM" - derives a two-letter monogram until real photos exist. */
function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="group relative flex h-full w-[85vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[40px] border border-brand-100 bg-white p-8 text-left shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1.5 sm:w-[340px] sm:max-w-none">
      <Spotlight />
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-semibold text-white"
        >
          {initialsOf(item.name)}
        </span>
        <div>
          <p className="font-semibold text-brand-900">{item.name}</p>
          <p className="text-sm text-brand-900/60">{item.role}</p>
        </div>
      </div>
      <Quotes
        size={28}
        weight="fill"
        className="mt-5 text-brand-200"
        aria-hidden="true"
      />
      <blockquote className="mt-3 flex-1 text-balance leading-relaxed text-brand-900/80">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
    </figure>
  );
}

export default function Testimonials({ data }: { data: TestimonialsData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;
      setMaxDrag(Math.max(0, track.scrollWidth - container.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [data.items.length]);

  const canDrag = maxDrag > 0;
  const lastIndex = Math.max(0, data.items.length - 1);

  // Derives the nearest card index from the live drag position so the dot
  // indicator below the rail tracks drag/scroll progress in real time.
  useMotionValueEvent(x, "change", (latest) => {
    if (maxDrag <= 0 || lastIndex === 0) {
      setActiveIndex(0);
      return;
    }
    const progress = Math.min(1, Math.max(0, -latest / maxDrag));
    setActiveIndex(Math.round(progress * lastIndex));
  });

  return (
    <section className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.title} />
      </p>
      <h2 className="mx-auto max-w-2xl text-balance text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.subtitle} delay={0.15} />
      </h2>

      <Reveal delay={0.2} className="mt-12">
        <div
          ref={containerRef}
          data-cursor="Drag"
          className="-mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6"
        >
          <motion.div
            ref={trackRef}
            drag={canDrag ? "x" : false}
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.08}
            dragTransition={
              prefersReducedMotion
                ? { power: 0, timeConstant: 0 }
                : { power: 0.2, timeConstant: 200 }
            }
            style={{ touchAction: "pan-y", x }}
            className={`flex w-fit gap-4 sm:gap-6 ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {data.items.map((item, i) => (
              <Reveal key={item.name} delay={0.08 * i} className="shrink-0">
                <TestimonialCard item={item} />
              </Reveal>
            ))}
          </motion.div>
        </div>

        {lastIndex > 0 && (
          <div
            aria-hidden="true"
            className="mt-6 flex items-center justify-center gap-2 sm:hidden"
          >
            {data.items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-brand-800"
                    : "w-1.5 bg-brand-200"
                }`}
              />
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}

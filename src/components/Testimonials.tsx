"use client";

import { CaretLeft, CaretRight, Quotes } from "@phosphor-icons/react/dist/ssr";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
  const [step, setStep] = useState(0);
  const [measured, setMeasured] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;
      setMaxDrag(Math.max(0, track.scrollWidth - container.clientWidth));
      // Card width + gap, measured from the first two cards.
      const [a, b] = [track.children[0], track.children[1]] as (
        | HTMLElement
        | undefined
      )[];
      setMeasured(true);
      setStep(a && b ? b.offsetLeft - a.offsetLeft : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [data.items.length]);

  const canDrag = maxDrag > 0;
  const lastIndex = Math.max(0, data.items.length - 1);

  // Derives the active card from the live x position so dots track
  // drag, click and arrow movement alike.
  useMotionValueEvent(x, "change", (latest) => {
    const start = latest > -1;
    const end = maxDrag > 0 && latest <= -maxDrag + 1;
    setAtStart(start);
    setAtEnd(end);
    if (maxDrag <= 0 || step <= 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex(
      end ? lastIndex : Math.min(lastIndex, Math.round(-latest / step)),
    );
  });

  const moveTo = (target: number) => {
    const clamped = Math.min(0, Math.max(-maxDrag, target));
    if (prefersReducedMotion) x.set(clamped);
    else animate(x, clamped, { type: "spring", stiffness: 300, damping: 34 });
  };
  const goToIndex = (i: number) => moveTo(-i * step);
  // Exactly one card from wherever the row currently rests (drag may leave it between cards).
  const prev = () => moveTo(-(Math.ceil(-x.get() / step - 0.01) - 1) * step);
  const next = () => moveTo(-(Math.floor(-x.get() / step + 0.01) + 1) * step);

  const onControlsKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const ring =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";
  const arrowCls = `flex h-10 w-10 items-center justify-center rounded-full border border-brand-800 bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:border-brand-200 disabled:bg-brand-100 disabled:text-brand-900/30 disabled:hover:bg-brand-100 ${ring}`;

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

        {lastIndex > 0 && (!measured || canDrag) && (
          <div
            onKeyDown={onControlsKey}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              aria-label="Previous testimonial"
              disabled={atStart}
              onClick={prev}
              className={arrowCls}
            >
              <CaretLeft size={18} weight="bold" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              {data.items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => goToIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${ring} ${
                    i === activeIndex
                      ? "w-6 bg-brand-800"
                      : "w-1.5 bg-brand-200"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              disabled={atEnd}
              onClick={next}
              className={arrowCls}
            >
              <CaretRight size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}

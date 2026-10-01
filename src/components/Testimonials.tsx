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
import Magnetic from "./motion/Magnetic";
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
    <figure className="group relative flex h-full w-[85vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[40px] border border-brand-100 bg-white p-8 text-left shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1.5 sm:w-[340px] sm:max-w-none">
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

// ponytail: fixed copy count; 5 sets of 4 cards cover ~7000px, raise if few cards meet very wide screens.
const SETS = 5;
const MID = Math.floor(SETS / 2);

// Same entrance as <Reveal>, staggered per card.
const cardReveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Testimonials({ data }: { data: TestimonialsData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = data.items.length;
  const mid = count > 1 ? MID : 0;
  // Render index of the centred card; kept inside the middle set between moves.
  const pos = useRef(mid * count);
  // x of render index p is base - p * step (both measured).
  const geo = useRef({ base: 0, step: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);

  const xFor = (p: number) => geo.current.base - p * geo.current.step;

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      const [a, b] = track
        ? ([track.children[0], track.children[1]] as (HTMLElement | undefined)[])
        : [];
      if (!container || !a) return;
      // Rects minus the current x give the untransformed card position.
      const cr = container.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      geo.current = {
        base: cr.width / 2 - (ar.left - x.get() - cr.left) - ar.width / 2,
        step: b ? b.getBoundingClientRect().left - ar.left : 0,
      };
      x.stop();
      pos.current = mid * count + mod(pos.current, count);
      x.set(xFor(pos.current));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, mid]);

  // Dots follow the live position, so they track drag, click and arrows alike.
  useMotionValueEvent(x, "change", (latest) => {
    const { base, step } = geo.current;
    if (step > 0) setActiveIndex(mod(Math.round((base - latest) / step), count));
  });

  // Silently shift back into the middle set; all sets look identical, so x jumps by whole sets invisibly.
  const recenter = () => {
    const shift = mid * count + mod(pos.current, count) - pos.current;
    if (!shift) return;
    pos.current += shift;
    x.set(x.get() - shift * geo.current.step);
  };

  const move = (delta: number) => {
    recenter();
    pos.current += delta;
    const target = xFor(pos.current);
    if (prefersReducedMotion) {
      x.set(target);
      recenter();
    } else {
      animate(x, target, {
        type: "spring",
        stiffness: 300,
        damping: 34,
        onComplete: recenter,
      });
    }
  };
  const prev = () => move(-1);
  const next = () => move(1);
  // Shortest way around the loop.
  const goToIndex = (i: number) => {
    const d = mod(i - pos.current, count);
    move(d > count / 2 ? d - count : d);
  };

  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const { step } = geo.current;
    let delta = step > 0 ? Math.round(-info.offset.x / step) : 0;
    if (delta === 0 && Math.abs(info.offset.x) > 50) {
      delta = info.offset.x < 0 ? 1 : -1;
    }
    move(delta);
  };

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
  const arrowCls = `flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 text-brand-900 transition-colors hover:bg-brand-50 ${ring}`;
  const edgeMask =
    "linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent)";
  const loop = count > 1;
  const sets = loop ? SETS : 1;

  return (
    <section className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.title} />
      </p>
      <h2 className="mx-auto max-w-2xl text-balance text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.subtitle} delay={0.15} />
      </h2>

      <Reveal delay={0.2} className="mt-12">
        {/* pt/-mt gives the hover lift room; pb keeps the shadow uncut and the controls clear of it. */}
        <div
          ref={containerRef}
          style={{ maskImage: edgeMask, WebkitMaskImage: edgeMask }}
          className="-mx-4 -mt-6 overflow-hidden px-4 pb-16 pt-6 sm:-mx-6 sm:px-6"
        >
          <motion.div
            ref={trackRef}
            drag={loop ? "x" : false}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            // One trigger for all copies: per-card whileInView would replay on far copies after a wrap.
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            style={{ touchAction: "pan-y", x }}
            className={`flex w-fit gap-4 sm:gap-6 ${loop ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {Array.from({ length: sets }, (_, s) =>
              data.items.map((item, i) => {
                const copy = s !== mid;
                return (
                  <motion.div
                    key={`${s}-${item.name}`}
                    variants={cardReveal}
                    custom={i}
                    className="shrink-0"
                  >
                    <div
                      aria-hidden={copy || undefined}
                      tabIndex={copy ? -1 : undefined}
                      className={`h-full transition-[transform,opacity] duration-500 ${
                        i === activeIndex ? "" : "scale-95 opacity-60"
                      }`}
                    >
                      <TestimonialCard item={item} />
                    </div>
                  </motion.div>
                );
              }),
            )}
          </motion.div>
        </div>

        {loop && (
          <div
            onKeyDown={onControlsKey}
            className="flex items-center justify-center gap-4"
          >
            <Magnetic>
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={prev}
                className={arrowCls}
              >
                <CaretLeft size={18} weight="bold" aria-hidden="true" />
              </button>
            </Magnetic>
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
            <Magnetic>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={next}
                className={arrowCls}
              >
                <CaretRight size={18} weight="bold" aria-hidden="true" />
              </button>
            </Magnetic>
          </div>
        )}
      </Reveal>
    </section>
  );
}

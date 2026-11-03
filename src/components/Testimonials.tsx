"use client";

import {
  CaretLeft,
  CaretRight,
  Translate,
} from "@phosphor-icons/react/dist/ssr";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import LinkedInLink from "./LinkedInLink";
import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import Spotlight from "./motion/Spotlight";
import type { QuoteLang, Testimonial, TestimonialsData } from "@/lib/types";

const QUOTE_MARKS: Record<QuoteLang, [string, string]> = {
  de: ["\u201E", "\u201C"],
  en: ["\u201C", "\u201D"],
};

function TestimonialCard({
  item,
  lang,
}: {
  item: Testimonial;
  lang: QuoteLang;
}) {
  const [open, close] = QUOTE_MARKS[lang];
  const paragraphs = item.quote[lang];
  return (
    <figure className="relative flex w-[85vw] max-w-[340px] shrink-0 flex-col pt-36 text-left transition-transform duration-300 hover:-translate-y-1.5 sm:w-[440px] sm:max-w-none sm:pt-44 lg:w-[520px]">
      {/* Portrait stands on the card's top edge and rises out of it (room is the figure's top padding). */}
      <Image
        src={item.image || "/images/testimonials/placeholder.svg"}
        alt=""
        width={300}
        height={360}
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-36 w-auto -translate-x-1/2 object-contain object-bottom grayscale sm:h-44"
      />
      {/* Card: 1px gradient border (white-ish at top, accent blue at the bottom). */}
      <div className="rounded-[28px] bg-gradient-to-b from-white/15 via-brand-800 to-brand-400 p-px shadow-[0px_20px_40px_rgba(15,29,54,0.25)]">
        <div className="group relative flex flex-col overflow-hidden rounded-[27px] bg-brand-950 p-6 sm:p-8">
          <Spotlight />
          <p className="text-lg font-semibold text-white">{item.name}</p>
          <p lang={lang} className="mt-0.5 text-sm text-brand-200">
            {item.role[lang]}
          </p>
          {/* Long quotes: slightly smaller type, paragraphs kept; a multi-part quote leads with its headline. */}
          <blockquote
            lang={lang}
            className="mt-4 space-y-3 text-pretty text-[15px] leading-relaxed text-brand-300 sm:text-base"
          >
            {paragraphs.map((text, i) => (
              <p
                key={i}
                className={
                  i === 0 && paragraphs.length > 1
                    ? "font-semibold text-white"
                    : undefined
                }
              >
                {open}
                {text}
                {close}
              </p>
            ))}
          </blockquote>
          {item.linkedin && (
            <LinkedInLink
              href={item.linkedin}
              name={item.name}
              tone="glass"
              expand={false}
              className="mt-6 self-center"
            />
          )}
        </div>
      </div>
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
  const [lang, setLang] = useState<QuoteLang>("de");
  // Viewport height follows the active card instead of the tallest one.
  const height = useMotionValue(0);
  const [sized, setSized] = useState(false);

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

  useEffect(() => {
    const card = trackRef.current?.children[mid * count + activeIndex]
      ?.firstElementChild as HTMLElement | null | undefined;
    if (!card) return;
    // Fires on observe, so it covers index and language changes, plus resizes and font loads.
    const ro = new ResizeObserver(() => {
      const h = card.offsetHeight; // layout height, unaffected by the scale/reveal transforms
      if (!sized || prefersReducedMotion) {
        height.set(h);
        setSized(true);
      } else {
        animate(height, h, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
      }
    });
    ro.observe(card);
    return () => ro.disconnect();
  }, [activeIndex, lang, count, mid, sized, prefersReducedMotion, height]);

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
  // Side fades plus a soft bottom edge where taller neighbouring cards are clipped.
  const edgeMask =
    "linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent), linear-gradient(to bottom, #000 calc(100% - 24px), transparent)";
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
        <div
          role="group"
          aria-label="Sprache der Zitate / Quote language"
          className="relative z-10 mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white p-1">
            <Translate
              size={16}
              className="ml-2 mr-1 text-brand-900/50"
              aria-hidden="true"
            />
            {(["de", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                lang={l}
                aria-label={l === "de" ? "Deutsch" : "English"}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${ring} ${
                  lang === l
                    ? "bg-brand-800 text-white"
                    : "text-brand-900 hover:bg-brand-50"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {/* pt/-mt gives the hover lift room; pb keeps the shadow uncut and the controls clear of it. */}
        <div
          ref={containerRef}
          style={{
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
          className="-mx-4 -mt-6 overflow-hidden px-4 pb-16 pt-6 sm:-mx-6 sm:px-6"
        >
          <motion.div style={sized ? { height } : undefined}>
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
              className={`flex w-fit items-start gap-4 sm:gap-6 ${loop ? "cursor-grab active:cursor-grabbing" : ""}`}
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
                        className={`transition-[transform,opacity] duration-500 ${
                          i === activeIndex ? "" : "scale-95 opacity-60"
                        }`}
                      >
                        <TestimonialCard item={item} lang={lang} />
                      </div>
                    </motion.div>
                  );
                }),
              )}
            </motion.div>
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

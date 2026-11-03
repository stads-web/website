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
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import LinkedInLink, { pillBase, pillSkin } from "./LinkedInLink";
import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import type { QuoteLang, Testimonial, TestimonialsData } from "@/lib/types";

const QUOTE_MARKS: Record<QuoteLang, [string, string]> = {
  de: ["\u201E", "\u201C"],
  en: ["\u201C", "\u201D"],
};

function TestimonialCard({
  item,
  lang,
  onToggleLang,
  fallbackLinkedin,
  copy,
}: {
  item: Testimonial;
  lang: QuoteLang;
  onToggleLang: () => void;
  fallbackLinkedin?: string;
  /** Loop copy or inactive card: keep its controls out of the tab order (focus would scroll the clipped track). */
  copy?: boolean;
}) {
  const focus = copy ? -1 : 0;
  const other: QuoteLang = lang === "de" ? "en" : "de";
  // Both languages sit in the same grid cell; the hidden one still takes space, so the card is as tall as the
  // longer version and switching never changes its height. Switching crossfades (opacity + 4px rise, site easing);
  // `visibility` flips at the end of the fade-out, so the hidden copy is out of the a11y tree and unclickable.
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const stacked = (render: (l: QuoteLang) => ReactNode) => (
    <div className="grid">
      {(["de", "en"] as const).map((l) => (
        <div
          key={l}
          lang={l}
          className={`transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] motion-reduce:transition-none ${
            l === lang ? "opacity-100" : "invisible translate-y-1 opacity-0"
          }`}
        >
          {render(l)}
        </div>
      ))}
    </div>
  );
  return (
    <figure className="relative flex h-full w-[85vw] max-w-[340px] shrink-0 flex-col pt-32 text-left transition-transform duration-300 hover:-translate-y-1.5 sm:w-[440px] sm:max-w-none sm:pt-52 lg:w-[480px] lg:pt-56">
      {/* Portrait stands on the card's top edge and rises out of it (room is the figure's top padding, same h-* steps).
          Photo format: 5:6 portrait (e.g. 600x720), cut-out person on a transparent background, cropped flat at the
          bottom edge; same frame as placeholder.webp (600x720), so real photos drop in 1:1. Shown in greyscale. */}
      <Image
        src={item.image || "/images/testimonials/placeholder.webp"}
        alt=""
        width={300}
        height={360}
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-32 w-auto -translate-x-1/2 object-contain object-bottom grayscale sm:h-52 lg:h-56"
      />
      {/* Card (as in the reference, but white): 1px border that runs out into brand blue at the bottom right,
          plus a soft blue glow in that corner. */}
      <div className="flex flex-1 flex-col rounded-xl bg-[radial-gradient(75%_60%_at_100%_100%,#203765,#5A6E97_35%,transparent_75%),linear-gradient(#E7ECF4,#E7ECF4)] p-px shadow-[0_20px_40px_rgba(15,29,54,0.08),10px_14px_32px_-14px_rgba(32,55,101,0.45)]">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[11px] bg-white bg-[radial-gradient(70%_45%_at_100%_100%,rgba(90,110,151,0.22),transparent_70%)] px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
          <p className="text-xl font-bold text-brand-950">{item.name}</p>
          <div className="mt-0.5 text-base text-brand-900">
            {stacked((l) => item.role[l])}
          </div>
          {/* Paragraphs kept; a multi-part quote leads with its headline. All cards share one height: the
              quote area is capped (13rem on phones, 17.5rem above, so portrait, card and arrows fit one
              screen), and longer quotes scroll inside it (vertical only, so horizontal swipes still move the
              carousel; the pb-6 padding sits under the fade). Sizing every card to the longest
              quote instead left big empty cards and pushed them past the screen height on phones and laptops. */}
          <blockquote
            ref={quoteRef}
            tabIndex={focus}
            className="mt-3 max-h-[13rem] overflow-y-auto sm:max-h-[17.5rem] [scrollbar-color:#CBD6E7_transparent] [scrollbar-width:thin] text-pretty pb-6 text-[15px] leading-relaxed sm:text-base text-brand-900/75 [mask-image:linear-gradient(to_bottom,#000_calc(100%-1.5rem),transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            {stacked((l) => {
              const [open, close] = QUOTE_MARKS[l];
              const paragraphs = item.quote[l];
              return (
                <div className="space-y-3">
                  {paragraphs.map((text, i) => (
                    <p
                      key={i}
                      className={
                        i === 0 && paragraphs.length > 1
                          ? "font-semibold text-brand-900"
                          : undefined
                      }
                    >
                      {open}
                      {text}
                      {close}
                    </p>
                  ))}
                </div>
              );
            })}
          </blockquote>
          {/* Footer at the bottom of the (uniformly tall) card: LinkedIn flush left, language toggle right, one line. */}
          <div
            className="mt-auto flex items-center justify-between gap-3 pt-5"
            // Taps here must not start a carousel drag.
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            {/* Personal profile once set; until then the STADS company page (labelled as STADS, not the person). */}
            {item.linkedin || fallbackLinkedin ? (
              <LinkedInLink
                href={item.linkedin || fallbackLinkedin!}
                name={item.linkedin ? item.name : "STADS"}
                tone="ink"
                touchOpen
                tabIndex={copy ? -1 : undefined}
              />
            ) : (
              <span />
            )}
            {/* Same pill and colour fill as the LinkedIn button (shared classes from LinkedInLink). */}
            <button
              type="button"
              tabIndex={copy ? -1 : undefined}
              onClick={() => {
                // The new language starts at its first line.
                const smooth = !window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                quoteRef.current?.scrollTo({
                  top: 0,
                  behavior: smooth ? "smooth" : "auto",
                });
                onToggleLang();
              }}
              aria-label={
                lang === "de"
                  ? `Zitat von ${item.name} auf Englisch anzeigen`
                  : `Show ${item.name}'s quote in German`
              }
              className={`${pillBase} gap-1.5 px-3.5 text-[13px] font-medium ${pillSkin.ink}`}
            >
              <Translate size={14} aria-hidden="true" />
              <span lang={other}>{other.toUpperCase()}</span>
            </button>
          </div>
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

export default function Testimonials({
  data,
  fallbackLinkedin,
}: {
  data: TestimonialsData;
  fallbackLinkedin?: string;
}) {
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
  // Language per person (not per rendered copy), so a card keeps its language when the loop wraps.
  const [langs, setLangs] = useState<QuoteLang[]>(() =>
    data.items.map(() => "de"),
  );
  const toggleLang = (i: number) =>
    setLangs((ls) =>
      ls.map((l, j) => (j === i ? (l === "de" ? "en" : "de") : l)),
    );

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

  // A drag must not also count as a click on a card (or on a link/button inside it).
  const dragged = useRef(false);
  // Clicking a side card moves to it, like the arrows; a real click there never reaches its buttons.
  // Keyboard clicks (detail 0) pass through, so Tab + Enter still works as before.
  const onCardClick = (e: MouseEvent, p: number) => {
    if (dragged.current && e.detail !== 0) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (p === pos.current || e.detail === 0) return;
    e.preventDefault();
    e.stopPropagation();
    move(p - pos.current);
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
  // Side fades plus a soft bottom edge.
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
        {/* pt/-mt gives the hover lift room; pb keeps the shadow uncut and the controls clear of it. */}
        <div
          ref={containerRef}
          style={{
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
          onScroll={(e) => {
            if (e.currentTarget.scrollLeft) e.currentTarget.scrollLeft = 0;
          }}
          className="-mx-4 -mt-6 overflow-hidden px-4 pb-10 pt-6 sm:-mx-6 sm:px-6"
        >
          <motion.div
              ref={trackRef}
              drag={loop ? "x" : false}
              dragMomentum={false}
              onDragStart={() => (dragged.current = true)}
              onPointerDownCapture={() => (dragged.current = false)}
              onDragEnd={onDragEnd}
              // One trigger for all copies: per-card whileInView would replay on far copies after a wrap.
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              style={{ touchAction: "pan-y", x }}
              className={`flex w-fit items-stretch gap-4 sm:gap-6 ${loop ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              {Array.from({ length: sets }, (_, s) =>
                data.items.map((item, i) => {
                  const copy = s !== mid;
                  const active = i === activeIndex;
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
                        onClickCapture={(e) => onCardClick(e, s * count + i)}
                        className={`h-full transition-[transform,opacity] duration-500 ${
                          active
                            ? ""
                            : "cursor-pointer scale-95 opacity-60 [@media(hover:hover)]:hover:opacity-80 [&_a]:pointer-events-none [&_button]:pointer-events-none"
                        }`}
                      >
                        <TestimonialCard
                          item={item}
                          lang={langs[i]}
                          onToggleLang={() => toggleLang(i)}
                          fallbackLinkedin={fallbackLinkedin}
                          copy={copy || !active}
                        />
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

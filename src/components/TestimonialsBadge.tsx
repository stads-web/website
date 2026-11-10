"use client";

import { CaretLeft, CaretRight, Quotes, Translate } from "@phosphor-icons/react/dist/ssr";
import {
  animate,
  frame as fmFrame,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import LinkedInLink, { pillBase, pillSkin } from "./LinkedInLink";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import type { QuoteLang, Testimonial, TestimonialsData } from "@/lib/types";

const QUOTE_MARKS: Record<QuoteLang, [string, string]> = {
  de: ["„", "“"],
  en: ["“", "”"],
};
const AUTOPLAY_MS = 6000;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// Same white card skin as Testimonials.tsx: 1px border running into brand blue at the bottom right, plus the blue corner glow.
const frame =
  "rounded-2xl bg-[radial-gradient(75%_60%_at_100%_100%,#203765,#5A6E97_35%,transparent_75%),linear-gradient(#E7ECF4,#E7ECF4)] p-px";
// Shadows: one big, very soft shadow under the front card (as in the video); plates only a faint contact shadow,
// so five stacked cards no longer add up to a dark band below the deck.
const SHADOW_FRONT = "shadow-[0_40px_80px_-28px_rgba(15,29,54,0.22),0_14px_30px_-18px_rgba(15,29,54,0.16)]";
const SHADOW_PLATE = "shadow-[0_6px_18px_-10px_rgba(15,29,54,0.14)]";
const face =
  "relative h-full rounded-[15px] bg-white bg-[radial-gradient(70%_45%_at_100%_100%,rgba(90,110,151,0.22),transparent_70%)]";

/*
 * Deck choreography, read frame by frame from the Dribbble video at 30 fps (card width W, t from the first move):
 *   t ms   leaving card            next card (first plate)   layer
 *     0    x 0     rot 0           x +4%  rot +3             leaving on top
 *    67    x -17%  rot +1          starts to come forward
 *   133    x -45%  rot +3.5        x +4%  rot +2
 *   200    x -75%  rot +3          x +4%  rot +1
 *   233                                                      swap: next card now above the leaving one
 *   267    x -80%  rot +4          x 0    rot 0 (in front)
 *   400    x -77%  rot +1          rest
 *   533    x -60%  rot 0
 *   600    x -35%  rot 0
 *   700    x -12%                                            leaving card tucks under the deck
 *   800    in its plate slot; old strap gone from ~330 ms
 *   800-1100  strap drops into the clip of the new front card and swings with a short overshoot
 * Backward is the mirror image (leaving card swings out to the right, turning the other way, and tucks into the
 * first plate slot while the previous card comes forward from the back). Dots switch immediately.
 * Every card is always rendered; its slot is its distance from the active card. Plates fan out right (slot 1) and
 * left (slot 2), so there is a card edge to click on both sides.
 */
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 2.2, y: -3, rotate: 2.5, scale: 0.98 },
  { x: -2.2, y: 2, rotate: -2.5, scale: 0.97 },
];
const slot = (p: number) => SLOTS[Math.min(p, SLOTS.length - 1)];
const pct = (v: number) => `${v}%`;
const DURATION = 0.8;
// Video timestamps (ms) of the leaving card's keyframes, as fractions of DURATION.
const TIMES = [0, 67, 133, 200, 267, 400, 533, 600, 700, 800].map((t) => t / 800);
const OUT_X = [0, -17, -45, -75, -80, -77, -60, -35, -12];
const OUT_ROT = [0, 1, 3.5, 3, 4, 1, 0, 0, 0];
const OUT_Y = [0, 1, 3, 4, 4, 3, 2, 1, 0];
const OUT_SCALE = [1, 1, 1, 0.99, 0.99, 0.98, 0.98, 0.97, 0.97];
// Next card: in front by ~270 ms with a soft settle.
const deckSpring = { type: "spring", stiffness: 210, damping: 26, mass: 1 } as const;
const SWAP_AT = 233;
const STRAP_DELAY = 0.8;
const STRAP_OUT_DELAY = 0.33;

// Swipe fling: the released card keeps going in the swipe direction in one decelerating move, fades out at the end,
// is placed in its slot while invisible (and already below the new front card), then fades in there.
// The ease is a cubic bezier [x1, y1, 0.3, 1] whose start slope y1/x1 is chosen so the card leaves at the finger's
// release speed (at least FLING_FLOOR, so a slow release still leaves). All control points stay in [0, 1], so the
// curve is monotonic.
const FLING_OFF = 120; // % of the card width
const FLING_MIN = 0.3;
const FLING_MAX = 0.6;
const FLING_FLOOR = 1; // minimum start slope (= average speed of the move)
const FLING_HIDE = FLING_MAX + 0.05; // s: jump to the slot (swap happens at FLING_MAX, before this)
const FLING_T = FLING_HIDE + 0.25;
const LAND = 0.25; // s: fade-in when a fling is interrupted

// Keyframes whose first value is null (= start from the current value).
const kf = <T,>(rest: T[]) => [null, ...rest] as [null, ...T[]];

const deckVariants = {
  slot: ({ p }: { p: number }) => ({
    ...slot(p),
    x: pct(slot(p).x),
    opacity: 1,
    transition: { ...deckSpring, delay: p === 0 ? 0.06 : 0.03 * p },
  }),
  // The old front card after a click/autoplay: swings out (left going forward, right going back), then tucks into
  // its new plate slot. Starts from wherever the card is right now (null), so a click during a running move takes
  // over smoothly instead of jumping.
  out: ({ p, d }: { p: number; d: number }) => {
    const end = slot(p);
    return {
      x: kf([...OUT_X.slice(1).map((v) => pct(v * d)), pct(end.x)]),
      rotate: kf([...OUT_ROT.slice(1).map((v) => v * d), end.rotate]),
      y: kf([...OUT_Y.slice(1), end.y]),
      scale: kf([...OUT_SCALE.slice(1), end.scale]),
      opacity: 1,
      transition: { duration: DURATION, times: TIMES, ease: "easeInOut", opacity: { duration: 0.2 } },
    };
  },
  // The old front card after a swipe (see FLING_*).
  fling: ({ p, d, from }: { p: number; d: number; from?: Offset }) => {
    const end = slot(p);
    const f = flingPath(d, from ?? { x: 0, rot: 0, v: 0 });
    const a = f.duration / FLING_T;
    const h = FLING_HIDE / FLING_T;
    const t = { duration: FLING_T, times: [0, a, h - 0.001, h, 1], ease: [f.ease, "linear", "linear", "linear"] };
    const settle = { duration: f.duration, ease: f.ease };
    return {
      x: [f.x0, f.x1, f.x1, end.x, end.x].map(pct),
      rotate: [f.r0, f.r1, f.r1, end.rotate, end.rotate],
      y: end.y,
      scale: end.scale,
      opacity: [1, 1, 0, 0, 1],
      transition: {
        x: t,
        rotate: t,
        y: settle,
        scale: settle,
        opacity: { duration: FLING_T, times: [0, 0.6 * a, a, h, 1], ease: "linear" },
      },
    };
  },
  // A fling interrupted by the next move before it reached its slot: appear there (no travel back across the
  // screen), fading in.
  land: ({ p }: { p: number }) => {
    const end = slot(p);
    return {
      x: pct(end.x),
      rotate: end.rotate,
      y: end.y,
      scale: end.scale,
      opacity: [0, 1],
      transition: { ...deckSpring, x: { duration: 0 }, rotate: { duration: 0 }, opacity: { duration: LAND, ease: "linear" } },
    };
  },
};

/** Start/end of a fling in % of the card width. Never moves toward the centre: the start is clamped to the swipe
 *  side and the end is at least 20% further out. d = 1 goes left (forward), d = -1 goes right (back). */
function flingPath(d: number, from: Offset) {
  const x0 = d > 0 ? Math.min(from.x, 0) : Math.max(from.x, 0);
  const x1 = -d * Math.max(FLING_OFF, Math.abs(x0) + 20);
  const dist = Math.abs(x1 - x0);
  const speed = Math.max(0, -d * from.v); // release speed along the fling, %/s
  // A start slope of 4 is a lively decelerating curve: use it to pick the duration, then fit the slope exactly.
  const duration = speed > 0 ? Math.min(FLING_MAX, Math.max(FLING_MIN, (4 * dist) / speed)) : FLING_MAX;
  const k = Math.max(FLING_FLOOR, (speed * duration) / dist);
  const ease: [number, number, number, number] = k <= 4 ? [0.2, 0.2 * k, 0.3, 1] : [1 / k, 1, 0.3, 1];
  return { x0, x1, r0: from.rot, r1: from.rot + 4 * d, duration, ease };
}

/** Clip slot (on every card) plus the strap that hangs out of it upwards (front card only); decorative. */
function Clip({ strap, reduce }: { strap: boolean; reduce: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
      {/* Strap: light, slightly transparent band rising out of the card; drops in after the card has settled and
          swings with a short overshoot; leaves quickly when the card moves away. */}
      <motion.div
        initial={false}
        // Rests slightly tilted, like the lanyard in the video.
        animate={strap ? { scaleY: 1, rotate: 8, opacity: 1 } : { scaleY: 0.4, rotate: -10, opacity: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : strap
              ? { delay: STRAP_DELAY, type: "spring", stiffness: 380, damping: 10, mass: 0.7, opacity: { delay: STRAP_DELAY, duration: 0.12 } }
              : { delay: STRAP_OUT_DELAY, duration: 0.12 }
        }
        style={{ transformOrigin: "50% 100%" }}
        className="absolute bottom-[3px] left-1/2 -ml-5 h-[88px] w-10 rounded-t-[3px] border border-white/70 bg-[linear-gradient(90deg,rgba(203,214,231,0.75),rgba(255,255,255,0.85)_45%,rgba(203,214,231,0.6))] shadow-[0_6px_14px_rgba(15,29,54,0.12)] backdrop-blur-[2px] [mask-image:linear-gradient(to_top,#000_70%,transparent)]"
      >
        {/* Fold of the band through the slot. */}
        <span className="absolute -bottom-[5px] left-1/2 h-3 w-[52px] -translate-x-1/2 rounded-full bg-[linear-gradient(#F4F6FA,#A8B7D1)] shadow-[0_2px_4px_rgba(15,29,54,0.25)]" />
      </motion.div>
      <div className="h-3.5 w-[60px] rounded-full bg-brand-950/85 shadow-[inset_0_2px_3px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function BadgeCard({
  item,
  lang,
  onToggleLang,
  fallbackLinkedin,
  shadow,
}: {
  item: Testimonial;
  lang: QuoteLang;
  onToggleLang: () => void;
  fallbackLinkedin?: string;
  shadow: string;
}) {
  const other: QuoteLang = lang === "de" ? "en" : "de";
  // Both languages share one grid cell (same as Testimonials.tsx): the card never changes height, switching crossfades.
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
  const href = item.linkedin || fallbackLinkedin;
  return (
    <div className={`${frame} ${shadow} h-full transition-shadow duration-500`}>
      <figure className={`${face} flex flex-col px-6 pb-8 pt-10 text-left sm:px-8 sm:pb-8 sm:pt-11`}>
        <Quotes size={26} weight="fill" aria-hidden className="text-brand-800" />
        {/* Always the full quote, no inner scroll: the stage is as tall as the tallest card (all cards share one grid cell). */}
        <blockquote className="mt-3 text-[14px] leading-[1.6] text-brand-900/75 sm:text-base sm:leading-relaxed [@media(hover:none)]:select-none">
          {stacked((l) => {
            const [o, c] = QUOTE_MARKS[l];
            const ps = item.quote[l];
            return (
              <div className="space-y-3">
                {ps.map((t, i) => (
                  <p key={i} className={i === 0 && ps.length > 1 ? "font-semibold text-brand-900" : undefined}>
                    {o}
                    {t}
                    {c}
                  </p>
                ))}
              </div>
            );
          })}
        </blockquote>
        {/* Name tag row, as in the video: round portrait bottom left, name and role beside it, actions right. */}
        {/* Phones: person block, then the buttons in their own row, flush left with the text. From sm: one row, buttons
            vertically centred on the person block, flush with the right inner edge, 24px clear of the text. */}
        <figcaption
          className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:gap-6"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-1 ring-brand-200 sm:h-14 sm:w-14">
              <Image
                src={item.image || "/images/testimonials/placeholder.webp"}
                alt=""
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight text-brand-950 sm:text-lg">{item.name}</p>
              <div className="mt-0.5 text-[13px] leading-snug text-brand-900 sm:text-sm">
                {stacked((l) => item.role[l])}
              </div>
            </div>
          </div>
          {/* From sm: fixed width = opened LinkedIn pill + language button, so opening the pill on hover never moves or
              rewraps name/role (they wrap for this width from the start); the pill grows leftwards inside. On touch
              the LinkedIn button stays the round icon (fineOnly: expands only with a real mouse), so the width is only reserved there. */}
          <div className="flex shrink-0 items-center gap-2 sm:justify-end sm:[@media(hover:hover)_and_(pointer:fine)]:w-[13rem]">
            {href && (
              <LinkedInLink href={href} name={item.linkedin ? item.name : "STADS"} tone="ink" fineOnly />
            )}
            <button
              type="button"
              onClick={onToggleLang}
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
        </figcaption>
      </figure>
    </div>
  );
}


/** Where a swipe let go: x in % of the card width, rotation in degrees, release velocity in % per second. */
type Offset = { x: number; rot: number; v: number };
const FLICK = 300; // px/s: a release faster than this counts as a deliberate flick

/** Finger-following swipe layer (touch/pen only; the mouse never drags). Tilts a little with the offset; the fling
 *  continues from exactly this position, rotation and speed. */
function Swipe({
  enabled,
  onSwipe,
  children,
}: {
  enabled: boolean;
  onSwipe: (d: number, from: Offset) => void;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const base = useRef(0);
  const rotate = useTransform(x, [-300, 0, 300], [4, 0, -4]);
  const ref = useRef<HTMLDivElement>(null);
  // No longer the front card (e.g. it changed mid-pan and onPanEnd never came): never leave it offset.
  useEffect(() => {
    if (!enabled) animate(x, 0, { type: "spring", stiffness: 300, damping: 35 });
  }, [enabled, x]);
  const onDragEnd = (e: PointerEvent, info: PanInfo) => {
    if (e.pointerType === "mouse") return;
    const ox = x.get();
    const vx = info.velocity.x;
    // A fast flick against the drag means "no": cancel. Otherwise the drag direction decides.
    const agree = Math.abs(vx) < FLICK || Math.sign(vx) === Math.sign(ox);
    if (!agree || Math.abs(ox + vx * 0.2) <= 80) {
      // Spring back, no change. Critically damped (ω ≈ 17.3) and seeded only with finger speed toward the centre,
      // capped at ω·|offset| so it never overshoots past 0: one monotonic move back.
      const toward = Math.min(Math.max(-Math.sign(ox) * vx, 0), 17 * Math.abs(ox));
      animate(x, 0, { type: "spring", stiffness: 300, damping: 35, velocity: -Math.sign(ox) * toward });
      return;
    }
    // Hand the finger offset over to the card's fling: commit the move synchronously, then zero this layer on the
    // next frame (when the fling keyframes start), so the card neither snaps back nor moves twice.
    const w = ref.current?.offsetWidth || 1;
    const from = { x: (x.get() / w) * 100, rot: rotate.get(), v: (vx / w) * 100 };
    flushSync(() => onSwipe(ox < 0 ? 1 : -1, from));
    fmFrame.update(() => x.jump(0));
  };
  return (
    <motion.div
      ref={ref}
      // A new touch catches the card where it is (e.g. mid spring-back) instead of fighting the running spring.
      onPanStart={enabled ? () => { x.stop(); base.current = x.get(); } : undefined}
      onPan={enabled ? (e, info) => { if (e.pointerType !== "mouse") x.set(base.current + info.offset.x); } : undefined}
      onPanEnd={enabled ? onDragEnd : undefined}
      style={{ x, rotate, touchAction: "pan-y" }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
}

export default function TestimonialsBadge({
  data,
  fallbackLinkedin,
}: {
  data: TestimonialsData;
  fallbackLinkedin?: string;
}) {
  const n = data.items.length;
  const reduce = !!useReducedMotion();
  // dir 0 = nothing moved yet (every card simply sits in its slot). prev = the card that was in front before this
  // move (the one that swings out); from = where a swipe let go of it; move = counter of moves (keys the layer swap).
  // at = when the move started; land = a card whose fling this move interrupted (it fades in at its slot).
  type Page = { index: number; dir: number; prev: number; from?: Offset; move: number; at: number; land?: number };
  const [{ index, dir, prev, from, move, land }, setPage] = useState<Page>({ index: 0, dir: 0, prev: 0, move: 0, at: 0 });
  const step = (s: Page, i: number, d: number, from?: Offset, at = performance.now()): Page => ({
    index: i,
    dir: d,
    prev: s.index,
    from,
    move: s.move + 1,
    at,
    land: s.from && at - s.at < FLING_HIDE * 1000 + 50 ? s.prev : undefined, // +50ms: framer starts the timeline a frame later
  });
  const [langs, setLangs] = useState<QuoteLang[]>(() => data.items.map(() => "de"));
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });

  const go = (d: number, from?: Offset) => {
    if (n < 2) return;
    const at = performance.now();
    setPage((s) => step(s, mod(s.index + d, n), d, from, at));
  };
  // Dots jump by their own distance; the old front card still swings out and tucks into its new slot.
  const goTo = (i: number) => {
    const at = performance.now();
    setPage((s) => (i === s.index ? s : step(s, i, i > s.index ? 1 : -1, undefined, at)));
  };
  // Latest animated deck offset of every card, so a swipe on a card that is still settling into the front slot
  // hands over its full on-screen position (deck offset + finger offset) without a snap.
  const deckPos = useRef<Record<number, { x: number; rotate: number }>>({});

  // Layer swap of the travelling card; keyed by the move counter so every new move (even back to the same index)
  // starts unswapped in its first frame. A fling stays on top until it has faded out.
  const flung = !!from;
  const [swappedAt, setSwappedAt] = useState(-1);
  const swapped = swappedAt === move;
  useEffect(() => {
    const t = setTimeout(() => setSwappedAt(move), reduce ? 0 : flung ? FLING_MAX * 1000 : SWAP_AT);
    return () => clearTimeout(t);
  }, [move, flung, reduce]);

  const autoplay = n > 1 && !reduce && !hover && !focus && !touched && inView;
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, index]);

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!d || n < 2) return;
    e.preventDefault();
    // Focus inside the front card would fall to <body> once that card turns inert: after the commit, move it to the
    // same control on the new front card, or to the current dot if there is none (not the region itself: a focusable
    // region would also take focus on every mouse click and keep autoplay paused).
    const sel = "a[href],button";
    const card = (e.target as Element).closest("[data-front]");
    const k = card ? Array.from(card.querySelectorAll(sel)).indexOf(e.target as Element) : -1;
    flushSync(() => go(d));
    if (!card) return;
    const next = k < 0 ? null : rootRef.current?.querySelector("[data-front]")?.querySelectorAll<HTMLElement>(sel)[k];
    (next ?? rootRef.current?.querySelector<HTMLElement>("[aria-current]"))?.focus({ preventScroll: true });
  };

  const item = data.items[index];
  const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";
  // Which deck move a card plays: only the old front card swings out; every other card springs to its slot.
  const variantFor = (i: number) =>
    reduce || dir === 0 ? "slot" : i === prev ? (flung ? "fling" : "out") : i === land ? "land" : "slot";

  // Stacking: front on top, plates below in order; the leaving card stays on top until the swap.
  const zFor = (i: number, p: number) => {
    const v = variantFor(i);
    return (v === "out" || v === "fling") && !swapped ? n + 1 : n - p;
  };

  return (
    // Clip sideways at the full viewport width, not at the content column, so the swinging card and the plates are
    // never cut at a visible edge (and the page never scrolls sideways).
    <section className="overflow-x-clip">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
          <SplitText text={data.title} />
        </p>
        <h2 className="mx-auto max-w-2xl text-balance text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
          <SplitText text={data.subtitle} delay={0.15} />
        </h2>

        <Reveal delay={0.2} className="mt-20 sm:mt-24">
          <div
            ref={rootRef}
            className="group/deck"
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            onKeyDown={onKey}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setFocus(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false);
            }}
            onTouchStart={() => setTouched(true)}
          >
            {/* All cards share one grid cell, so the deck is as tall as the tallest card over all people and both
                languages (each card stacks DE and EN): every card always shows its full content, nothing jumps. */}
            <div className="relative isolate mx-auto grid w-full max-w-[680px]">
              {/* Pointer only: the space left/right of the deck turns back/forward, with a soft arrow on hover.
                  Touch swipes instead; keyboard uses the dots and the arrow keys. */}
              {n > 1 &&
                ([-1, 1] as const).map((d) => (
                  <div
                    key={d}
                    aria-hidden
                    onClick={() => go(d)}
                    className={`group/side absolute inset-y-0 hidden w-[min(14rem,calc((100vw-100%)/2))] cursor-pointer items-center [@media(hover:hover)]:flex ${
                      d === -1 ? "right-full justify-end pr-6" : "left-full justify-start pl-6"
                    }`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white/80 text-brand-800 opacity-0 shadow-card transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/deck:opacity-100 group-focus-within/deck:opacity-100 group-active/side:scale-95">
                      {d === -1 ? <CaretLeft size={18} weight="bold" /> : <CaretRight size={18} weight="bold" />}
                    </span>
                  </div>
                ))}
              {data.items.map((it, i) => {
                const p = mod(i - index, n);
                const front = p === 0;
                return (
                  <motion.div
                    key={it.name}
                    custom={{ p, d: dir === -1 ? -1 : 1, from }}
                    variants={deckVariants}
                    initial={false}
                    animate={variantFor(i)}
                    transition={reduce ? { duration: 0 } : undefined}
                    style={{ zIndex: zFor(i, p) }}
                    onUpdate={(l) => {
                      const c = (deckPos.current[i] ??= { x: 0, rotate: 0 });
                      if (l.x !== undefined) c.x = parseFloat(String(l.x));
                      if (l.rotate !== undefined) c.rotate = Number(l.rotate);
                    }}
                    // Peeking plates: the right one turns forward, the left one back. Their content is inert, so clicks
                    // fall through to here; the front card has no handler, so its LinkedIn/language buttons never navigate.
                    onClick={p === 1 ? () => go(1) : p === 2 && n > 2 ? () => go(-1) : undefined}
                    className={`relative [grid-area:1/1] ${p === 1 || (p === 2 && n > 2) ? "cursor-pointer" : ""}`}
                  >
                    <Swipe
                      enabled={front && n > 1}
                      onSwipe={(d, f) => {
                        const c = deckPos.current[i];
                        go(d, c ? { ...f, x: f.x + c.x, rot: f.rot + c.rotate } : f);
                      }}
                    >
                      <Clip strap={front} reduce={reduce} />
                      {/* Reduced motion: plain crossfade of the front content instead of the deck move. */}
                      <motion.div
                        key={reduce && front ? `f${index}` : "card"}
                        initial={reduce && front ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="h-full"
                        {...(front
                          ? {
                              role: "group",
                              "aria-roledescription": "slide",
                              "aria-label": `${i + 1} / ${n}: ${it.name}`,
                              "data-front": true,
                            }
                          : { "aria-hidden": true, inert: true })}
                      >
                        <BadgeCard
                          item={it}
                          lang={langs[i]}
                          onToggleLang={() =>
                            setLangs((ls) => ls.map((l, j) => (j === i ? (l === "de" ? "en" : "de") : l)))
                          }
                          fallbackLinkedin={fallbackLinkedin}
                          shadow={front ? SHADOW_FRONT : p < 3 ? SHADOW_PLATE : ""}
                        />
                      </motion.div>
                    </Swipe>
                  </motion.div>
                );
              })}
            </div>

            <p className="sr-only" aria-live={autoplay ? "off" : "polite"} aria-atomic="true">
              {`Testimonial ${index + 1} von ${n}: ${item.name}`}
            </p>

            {n > 1 && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center">
                  {data.items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => goTo(i)}
                      // 24x24px tap target around the same small dot (dots end up slightly further apart than before).
                      className={`group/dot flex h-6 min-w-6 items-center justify-center rounded-full ${ring}`}
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-300 ${
                          i === index ? "w-6 bg-brand-800" : "w-1.5 bg-brand-200 [@media(hover:hover)]:group-hover/dot:bg-brand-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

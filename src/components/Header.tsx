"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { SiteData } from "@/lib/types";
import MeshBackdrop from "@/components/motion/MeshBackdrop";

const EASE = [0.22, 1, 0.36, 1] as const;

// Circle-wipe origin sits roughly on the toggle button, so the overlay reads
// as if it unfurls from the button itself rather than an unrelated corner.
const overlayVariants: Variants = {
  closed: { clipPath: "circle(0% at calc(100% - 4rem) 2.25rem)" },
  open: { clipPath: "circle(150% at calc(100% - 4rem) 2.25rem)" },
};

const listVariants: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 28 },
  open: { opacity: 1, y: 0 },
};

/** Two bars that cross into an X by rotating their own geometry (no icon swap). */
function MenuToggleIcon({ open }: { open: boolean }) {
  const bar = "absolute inset-x-0 h-[1.5px] rounded-full bg-current";
  return (
    <span className="relative block h-[18px] w-5" aria-hidden>
      <motion.span
        className={bar}
        initial={false}
        animate={{ top: open ? 8 : 4, rotate: open ? 45 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      <motion.span
        className={bar}
        initial={false}
        animate={{ top: open ? 8 : 12, rotate: open ? -45 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </span>
  );
}

/** Label that rolls upward when it changes ("Menu" -> "Close"). */
function RollingLabel({ text }: { text: string }) {
  return (
    <span className="relative inline-flex h-5 overflow-hidden text-sm font-medium leading-5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Colour of each page's first pixel row on a phone at scroll 0 (measured in
// the iOS simulator). Safari paints the status-bar strip in the top edge's
// colour (an image there is ignored), so the strip reads as part of the page
// top. Default: the PageTopFade band (For Students, Join us, Events, legal).
const TOP_EDGE: Record<string, string> = {
  "/": "#203351",
  "/datathon": "#1c253b",
  "/for-companies": "#0f1d36",
  "/our-team": "#f0f3f8",
};

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Desktop logo floats free (no pill behind it), so it follows what is under
  // it: sections marked data-header-dark keep it white after scrolling.
  const [overDark, setOverDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const topEdge = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const onDark = open || !scrolled;
  const barPad = "pt-[max(0px,calc(env(safe-area-inset-top,0px)-0.75rem))]";
  const barAnimate = { y: hidden && !open ? "-130%" : 0 };
  const barTransition = { duration: prefersReducedMotion ? 0 : 0.45, ease: EASE };

  useEffect(() => {
    let edgeTimer: number | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      // Top edge strip (see below): off as soon as the page moves, back only
      // once it has settled at the top - shown during the scroll back, Safari
      // misses it and the status-bar strip stays white.
      const edge = topEdge.current;
      window.clearTimeout(edgeTimer);
      if (edge && y > 2) edge.style.display = "none";
      else if (edge)
        edgeTimer = window.setTimeout(() => {
          if (window.scrollY <= 2) edge.style.display = "";
        }, 250);
      setScrolled(y > 40);
      // 32px ~ vertical centre of the desktop logo.
      setOverDark(
        Array.from(document.querySelectorAll("[data-header-dark]")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 32 && r.bottom > 32;
        })
      );
      // Mobile bar tucks away while reading downwards and returns on any
      // upward flick; it never hides near the top of the page.
      if (y < 120) setHidden(false);
      else if (y - lastY.current > 8) setHidden(true);
      else if (lastY.current - y > 8) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(edgeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close the drawer on route change and when the viewport grows to desktop
  // (the overlay is lg:hidden, so an open state would otherwise stay stuck).
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // While the drawer is open: lock page scroll, keep Escape closing it, and
  // take the rest of the page out of the tab/AT order so focus can't leak
  // behind the scrim (no focus-trap existed here before this).
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inertTargets = Array.from(document.querySelectorAll<HTMLElement>("main, footer, [data-consent-banner]"));
    inertTargets.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // Safari 26 (iOS) tints the status bar solid from a full-width fixed element
    // at the screen top (theme-color is ignored). Below lg the see-through header
    // box therefore starts at least 8px down, so the page shows through under the
    // clock instead; the bar pulls itself back up by the same amount (-mt below),
    // so the buttons do not move. lg and up: top 0 as before.
    <>
    <header className="pointer-events-none fixed inset-x-0 top-[max(8px,calc(env(safe-area-inset-top,0px)-0.75rem))] z-[60] pl-safe pr-safe lg:top-0">
      {/* The header box itself is see-through and, with the status-bar inset,
          ~120px tall on notched iPhones: only its controls take taps. */}
      {/* Three real columns rather than a centred group with an absolutely
          placed logo - that version collided once the viewport narrowed. */}
      <div className="relative z-20 mx-auto flex max-w-content items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:py-4">
        <Link
          href="/"
          aria-label="STADS home"
          className="pointer-events-auto hidden shrink-0 items-center lg:flex"
        >
          {/* Both logo variants are stacked in the same box and cross-fade via
              opacity instead of swapping `src` outright, which used to pop. */}
          <span className="relative block aspect-[2533/534] w-[115px] xl:w-[145px]">
            <motion.span
              className="absolute inset-0"
              animate={{ opacity: scrolled && !overDark ? 0 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Image
                src="/brand/stads-logo-white.svg"
                alt="STADS"
                fill
                priority
                sizes="145px"
                className="object-contain"
              />
            </motion.span>
            <motion.span
              className="absolute inset-0"
              animate={{ opacity: scrolled && !overDark ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Image
                src="/brand/stads-logo-dark.svg"
                alt="STADS"
                fill
                priority
                sizes="145px"
                className="object-contain"
              />
            </motion.span>
          </span>
        </Link>

        <nav
          className={`pointer-events-auto mx-auto hidden items-center gap-5 rounded-full px-8 py-2 backdrop-blur-[10px] transition-colors duration-300 lg:flex xl:gap-[30px] xl:px-10 ${
            scrolled ? "border border-brand-100 bg-white/90 shadow-card" : "border border-white/15 bg-white/20"
          }`}
        >
          {site.nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[13px] font-normal transition-colors ${
                  scrolled
                    ? active
                      ? "text-brand-900"
                      : "text-brand-900/60 hover:text-brand-900"
                    : active
                      ? "text-white [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]"
                      : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* The button itself stays put; only the ring answers the cursor. */}
        <div className="group pointer-events-auto relative hidden shrink-0 items-center justify-center p-1.5 lg:flex">
          <span
            aria-hidden
            className={`border-beam ${scrolled ? "border-beam--dark" : ""}`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 scale-95 rounded-full border transition-all duration-500 group-hover:scale-100 ${
              scrolled
                ? "border-brand-100 group-hover:border-brand-200"
                : "border-white/15 group-hover:border-white/40"
            }`}
          />
          <Link
            href={site.joinCta.href}
            className="relative flex h-[30px] w-[109px] items-center justify-center rounded-full border border-white/15 bg-white text-center text-sm font-bold text-black shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[7px] transition-transform duration-300 hover:scale-[1.04]"
          >
            {site.joinCta.label}
          </Link>
        </div>

        {/* The status-bar inset lives on the sliding parts (not the row), so the
            -130% hide below also clears it; with no inset this is 0.
            Only the two pills slide, never a full-width box: Safari 26 hit-tests
            the screen's top centre (ignoring clipping and pointer-events) and, if
            a full-width fixed element is there, tints the status bar with a
            colour sampled at that moment and keeps it. A full-width bar sliding
            over that point during hide/show froze such a colour. */}
        <div className="flex w-full items-center justify-between -mt-[max(8px,calc(env(safe-area-inset-top,0px)-0.75rem))] lg:hidden">
          <motion.div className={barPad} animate={barAnimate} transition={barTransition}>
          <Link
            href="/"
            aria-label="STADS home"
            onClick={() => setOpen(false)}
            className={`pointer-events-auto relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              onDark
                ? "border-white/15 bg-brand-950/85"
                : "border-brand-100 bg-white/95 shadow-card"
            }`}
          >
            <span className="relative block h-[26px] w-[26px]">
              <motion.span
                className="absolute inset-0"
                animate={{ opacity: onDark ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Image src="/brand/stads-mark-white.svg" alt="" fill priority sizes="26px" />
              </motion.span>
              <motion.span
                className="absolute inset-0"
                animate={{ opacity: onDark ? 0 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Image src="/brand/stads-mark-dark.svg" alt="" fill priority sizes="26px" />
              </motion.span>
            </span>
          </Link>
          </motion.div>

          <motion.div className={`flex items-center ${barPad}`} animate={barAnimate} transition={barTransition}>
            <button
              type="button"
              className={`pointer-events-auto flex h-12 cursor-pointer items-center gap-3 rounded-full border pl-5 pr-4 transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                onDark
                  ? "border-white/15 bg-brand-950/85 text-white"
                  : "border-brand-100 bg-white/95 text-brand-900 shadow-card"
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <RollingLabel text={open ? "Close" : "Menu"} />
              <MenuToggleIcon open={open} />
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            data-lenis-prevent
            className="pointer-events-auto fixed inset-0 z-10 flex flex-col overflow-hidden bg-brand-950 pl-safe pr-safe lg:hidden"
            style={{ height: "100dvh" }}
            variants={prefersReducedMotion ? undefined : overlayVariants}
            initial={prefersReducedMotion ? { opacity: 0 } : "closed"}
            animate={prefersReducedMotion ? { opacity: 1 } : "open"}
            exit={prefersReducedMotion ? { opacity: 0 } : "closed"}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE }}
          >
            <MeshBackdrop contained />

            <motion.ul
              className="relative z-10 flex flex-1 flex-col justify-center gap-1 px-8"
              variants={prefersReducedMotion ? undefined : listVariants}
              initial={prefersReducedMotion ? false : "closed"}
              animate={prefersReducedMotion ? undefined : "open"}
              exit={prefersReducedMotion ? undefined : "closed"}
            >
              {site.nav.map((item, index) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    variants={prefersReducedMotion ? undefined : itemVariants}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2.5"
                    >
                      <span className="font-sans text-xs tabular-nums text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-accent text-4xl italic transition-colors sm:text-5xl ${
                          active ? "text-white" : "text-white/85 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              className="relative z-10 px-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
              variants={prefersReducedMotion ? undefined : itemVariants}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Link
                href={site.joinCta.href}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-white px-4 py-3.5 text-center text-base font-semibold text-brand-900 shadow-card"
              >
                {site.joinCta.label}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    {/* iOS Safari 26 at scroll 0: the strip behind the status bar lies above
        the page and takes the body's white. A full-width fixed strip at
        the screen top makes Safari paint it in that colour (TOP_EDGE), so it
        runs into the top of every page. Only at the top (see onScroll):
        further down, content shows through under the clock. Touch portrait only. */}
    <div
      ref={topEdge}
      aria-hidden
      style={{ backgroundColor: open ? "#0f1d36" : TOP_EDGE[pathname] ?? "#273d69" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[61] hidden h-1.5 [@media(hover:none)_and_(orientation:portrait)]:block"
    />
    </>
  );
}

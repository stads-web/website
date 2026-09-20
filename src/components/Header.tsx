"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import type { SiteData } from "@/lib/types";
import MeshBackdrop from "@/components/motion/MeshBackdrop";

const EASE = [0.22, 1, 0.36, 1] as const;

// Circle-wipe origin sits roughly on the toggle button, so the overlay reads
// as if it unfurls from the button itself rather than an unrelated corner.
const overlayVariants: Variants = {
  closed: { clipPath: "circle(0% at calc(100% - 2.75rem) 2.75rem)" },
  open: { clipPath: "circle(150% at calc(100% - 2.75rem) 2.75rem)" },
};

const listVariants: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 28 },
  open: { opacity: 1, y: 0 },
};

/** Hamburger that morphs into an X by rotating/fading its own three bars, rather than swapping icon components. */
function MenuToggleIcon({ open }: { open: boolean }) {
  const bar = "absolute inset-x-0 h-[1.5px] rounded-full bg-white";
  return (
    <span className="relative block h-5 w-5" aria-hidden>
      <motion.span
        className={bar}
        animate={{ top: open ? 9 : 4, rotate: open ? 45 : 0 }}
        transition={{ duration: 0.32, ease: EASE }}
      />
      <motion.span
        className={bar}
        style={{ top: 9 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <motion.span
        className={bar}
        animate={{ top: open ? 9 : 14, rotate: open ? -45 : 0 }}
        transition={{ duration: 0.32, ease: EASE }}
      />
    </span>
  );
}

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is open: lock page scroll, keep Escape closing it, and
  // take the rest of the page out of the tab/AT order so focus can't leak
  // behind the scrim (no focus-trap existed here before this).
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inertTargets = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
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
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Three real columns rather than a centred group with an absolutely
          placed logo - that version collided once the viewport narrowed. */}
      <div className="relative z-20 mx-auto flex max-w-content items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="STADS home"
          className="hidden shrink-0 items-center lg:flex"
        >
          {/* Both logo variants are stacked in the same box and cross-fade via
              opacity instead of swapping `src` outright, which used to pop. */}
          <span className="relative block aspect-[351/109] w-[112px] xl:w-[140px]">
            <motion.span
              className="absolute inset-0"
              animate={{ opacity: scrolled ? 0 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Image
                src="/images/logo_hero.webp"
                alt="STADS"
                fill
                priority
                sizes="140px"
                className="object-contain"
              />
            </motion.span>
            <motion.span
              className="absolute inset-0"
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Image
                src="/images/stads_logo_dark.webp"
                alt="STADS"
                fill
                priority
                sizes="140px"
                className="object-contain"
              />
            </motion.span>
          </span>
        </Link>

        <nav
          className={`mx-auto hidden items-center gap-5 rounded-full px-8 py-2 backdrop-blur-[10px] transition-colors duration-300 lg:flex xl:gap-[30px] xl:px-10 ${
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
        <div className="group relative hidden shrink-0 items-center justify-center p-1.5 lg:flex">
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

        <div className="flex w-full items-center justify-between rounded-full bg-brand-950/55 px-4 py-2.5 backdrop-blur-md lg:hidden">
          <Link href="/" className="text-sm font-semibold text-white" onClick={() => setOpen(false)}>
            STADS
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuToggleIcon open={open} />
          </button>
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
            className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-brand-950 lg:hidden"
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
  );
}

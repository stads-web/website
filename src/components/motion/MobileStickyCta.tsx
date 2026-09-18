"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CtaLink } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fixed "Join STADS" bar for phones/tablets. Hidden until the visitor has
 * scrolled roughly past the hero, so it doesn't compete with it - then stays
 * pinned above the home-indicator/notch area so the CTA is never buried in
 * the hamburger drawer.
 */
export default function MobileStickyCta({ cta }: { cta: CtaLink }) {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let threshold = window.innerHeight * 0.85;

    const onScroll = () => setVisible(window.scrollY > threshold);
    const onResize = () => {
      threshold = window.innerHeight * 0.85;
      onScroll();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-brand-950/95 px-4 backdrop-blur-md lg:hidden"
          style={{ paddingTop: "0.75rem", paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <Link
            href={cta.href}
            className="block rounded-full bg-white px-4 py-3 text-center text-base font-semibold text-brand-900 shadow-card transition-transform duration-200 active:scale-[0.98]"
          >
            {cta.label}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

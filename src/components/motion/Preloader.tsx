"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "stads-preloader-shown";

// Timings sum to a short, premium reveal (~1.1s) including the exit fade.
const HOLD_MS = 750;
const EXIT_S = 0.35;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One-time, per-tab intro: the real STADS mark fades and scales into view,
 * then the whole overlay fades to reveal the page beneath. Gated on
 * sessionStorage so it never replays on internal navigation, and skipped
 * entirely under prefers-reduced-motion.
 */
export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Decide once, synchronously on mount, whether this tab/session gets the intro.
  useEffect(() => {
    try {
      const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.setItem(STORAGE_KEY, "1");
      if (alreadyShown || prefersReducedMotion) return;
      setShouldRender(true);
      setVisible(true);
    } catch {
      // sessionStorage unavailable (e.g. locked-down privacy mode) - just skip.
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!shouldRender) return;
    const holdTimer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(holdTimer);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_S, ease: EASE }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Image
              src="/images/stads_mark.webp"
              alt=""
              width={76}
              height={76}
              priority
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

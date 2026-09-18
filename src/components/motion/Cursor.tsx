"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"]';
const CURSOR_LABEL = "[data-cursor]";

/**
 * A soft glow trailing the pointer. Deliberately does NOT hide the native
 * cursor - replacing it made things hard to aim at - so this is pure accent.
 *
 * Elements can opt into a small contextual label (e.g. `data-cursor="View"`)
 * that rides alongside the glow whenever the pointer is over them or one of
 * their descendants. Tracked via a single pair of delegated listeners on
 * `document` - not per-element - so adding the attribute anywhere in the
 * tree stays cheap.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glowX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(reduced.matches);
    if (!fine.matches || reduced.matches) return;

    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onLeave = () => {
      setVisible(false);
      setLabel(null);
    };

    // Event delegation: one listener pair on `document` instead of one per
    // labelled element. `closest` walks up from the actual event target so
    // the label still resolves when hovering a child of the labelled node.
    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const match = target?.closest?.(CURSOR_LABEL) as HTMLElement | null;
      if (match) setLabel(match.getAttribute("data-cursor"));
    };
    const onOut = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const match = target?.closest?.(CURSOR_LABEL) as HTMLElement | null;
      if (!match) return;
      const related = event.relatedTarget as Element | null;
      // Only clear once the pointer has actually left the labelled element
      // (not just moved between its children).
      if (!related || !match.contains(related)) setLabel(null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [x, y]);

  if (!enabled) return null;

  const labelTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 24, mass: 0.5 };

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        animate={{
          opacity: visible ? (active ? 0.5 : 0.28) : 0,
          scale: active ? 1.9 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-[70px] -mt-[70px] h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(115,136,176,0.55),transparent_65%)] blur-xl"
      />
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none fixed left-0 top-0 z-[71] -translate-x-1/2 translate-y-7"
      >
        <AnimatePresence>
          {visible && label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={labelTransition}
              className="block whitespace-nowrap rounded-full bg-brand-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

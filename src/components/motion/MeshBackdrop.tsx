"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const blob = (color: string) =>
  `radial-gradient(circle at center, ${color} 0%, transparent 68%)`;

/**
 * Nudges a blob a few pixels toward the cursor, layered on top of its own
 * CSS drift animation (kept on a separate element - see below - since a
 * running CSS animation on `transform` would otherwise fight this motion
 * value for the same property). No-ops under reduced motion, and naturally
 * does nothing on touch-only devices since no mousemove ever fires there.
 */
function usePointerFollow(amount: number) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 40, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 40, damping: 20, mass: 0.8 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      x.set(nx * amount);
      y.set(ny * amount);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [amount, x, y]);

  return { x: springX, y: springY };
}

/**
 * `contained` swaps the viewport-pinned `fixed` positioning for `absolute`,
 * filling a positioned ancestor instead - used to drop the same drifting
 * blobs into a fullscreen overlay (e.g. the mobile nav) without the
 * footer-height exclusion, which only makes sense for the page-wide instance.
 */
export default function MeshBackdrop({ contained = false }: { contained?: boolean }) {
  const followA = usePointerFollow(14);
  const followB = usePointerFollow(10);
  const followC = usePointerFollow(18);

  return (
    <div
      aria-hidden
      // Stop short of the footer (--footer-h, published by FooterReveal) - being
      // `fixed`, this would otherwise keep painting on top of it forever, no
      // matter what background the footer itself sets.
      className={`pointer-events-none z-0 overflow-hidden ${
        contained ? "absolute inset-0" : "fixed inset-x-0 top-0 bottom-[var(--footer-h)]"
      }`}
    >
      <motion.div
        style={{ x: followA.x, y: followA.y }}
        className="absolute -left-[15%] top-[8%] h-[55vw] w-[55vw] max-h-[720px] max-w-[720px] will-change-transform"
      >
        <div
          className="animate-drift-a absolute inset-0"
          style={{ backgroundImage: blob("rgba(115,136,176,0.30)") }}
        />
      </motion.div>
      <motion.div
        style={{ x: followB.x, y: followB.y }}
        className="absolute -right-[12%] top-[38%] h-[48vw] w-[48vw] max-h-[640px] max-w-[640px] will-change-transform"
      >
        <div
          className="animate-drift-b absolute inset-0"
          style={{ backgroundImage: blob("rgba(32,55,101,0.16)") }}
        />
      </motion.div>
      <motion.div
        style={{ x: followC.x, y: followC.y }}
        className="absolute bottom-[6%] left-[22%] h-[42vw] w-[42vw] max-h-[560px] max-w-[560px] will-change-transform"
      >
        <div
          className="animate-drift-c absolute inset-0"
          style={{ backgroundImage: blob("rgba(168,183,209,0.32)") }}
        />
      </motion.div>
    </div>
  );
}

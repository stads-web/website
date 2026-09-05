"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"]';

/**
 * A soft glow trailing the pointer. Deliberately does NOT hide the native
 * cursor - replacing it made things hard to aim at - so this is pure accent.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glowX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
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
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const BAR =
  "pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-brand-500 via-brand-600 to-brand-900";

/** Fallback for browsers without CSS scroll timelines. */
function ScriptedBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden style={{ scaleX }} className={BAR} />;
}

export default function ScrollProgress() {
  const [native, setNative] = useState(true);
  useEffect(() => {
    setNative(CSS.supports("animation-timeline", "scroll()"));
  }, []);

  // Where supported, the bar is a pure CSS scroll-driven animation: zero JS per frame.
  return native ? <div aria-hidden className={`scroll-progress ${BAR}`} /> : <ScriptedBar />;
}

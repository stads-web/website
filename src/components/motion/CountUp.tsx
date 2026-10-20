"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts the first number inside a label up from zero ("250+", "Est. 2017").
 * Labels without a number render unchanged.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // No negative margin: stats parked near the bottom edge of a 100svh hero
  // (mobile) would sit inside the shrunken root and never count as in view.
  const inView = useInView(ref, { once: true });
  const digits = value.match(/\d+/)?.[0];
  const [display, setDisplay] = useState(() =>
    digits ? value.replace(digits, "0") : value
  );

  useEffect(() => {
    if (!digits || !inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, Number(digits), {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) =>
        setDisplay(value.replace(digits, String(Math.round(latest)))),
    });
    // Guarantee the real number even if frames stall (throttled/background
    // tab, low-power mode) and the tween never reaches its end.
    const done = setTimeout(() => setDisplay(value), 1600);
    return () => {
      controls.stop();
      clearTimeout(done);
    };
  }, [digits, inView, value]);

  if (!digits) return <>{value}</>;

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

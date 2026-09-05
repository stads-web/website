"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts the first number inside a label up from zero ("250+", "Est. 2017").
 * Labels without a number render unchanged.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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
    return () => controls.stop();
  }, [digits, inView, value]);

  if (!digits) return <>{value}</>;

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

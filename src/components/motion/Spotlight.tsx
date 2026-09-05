"use client";

import { useEffect, useRef } from "react";

/**
 * Soft glow that follows the cursor across a card.
 * Drop it inside a positioned element that also carries the `group` class.
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent) return;

    const onMove = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      element.style.setProperty("--x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--y", `${event.clientY - rect.top}px`);
    };

    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(340px circle at var(--x, 50%) var(--y, 50%), rgba(115,136,176,0.22), transparent 62%)",
      }}
    />
  );
}

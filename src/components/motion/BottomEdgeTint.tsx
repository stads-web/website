"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const WHITE = "rgb(255, 255, 255)";

/** First ancestor background with alpha > 0.5, walking up from `el`; white if none. */
function backgroundAt(el: Element | null): string {
  for (let node = el; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    const [, , , alpha = "1"] = color.match(/[\d.]+/g) ?? [];
    if (color.startsWith("rgb") && Number(alpha) > 0.5) return color;
  }
  return WHITE;
}

/**
 * Safari 26 (iOS) paints the strip behind its bottom toolbar in the background
 * colour of the fixed element at the bottom edge; with none there it falls back
 * to the page background (navy) and keeps the last colour it found. This strip
 * is that element and takes the background of whatever page content sits at
 * the bottom centre. It only shows where there is a bottom safe area (iOS 26),
 * and never on mouse devices.
 */
export default function BottomEdgeTint() {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(WHITE);
  const [hasInset, setHasInset] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const strip = ref.current;
    if (!strip) return;
    const mouse = window.matchMedia("(hover: hover)");
    let raf = 0;
    let timer = 0;
    const update = () => {
      raf = 0;
      if (mouse.matches) return; // strip is CSS-hidden there anyway
      // padding-bottom is env(safe-area-inset-bottom): 0 on Android, iOS 18 with
      // the toolbar out, and desktop - then the strip stays hidden.
      setHasInset(parseFloat(getComputedStyle(strip).paddingBottom) > 0);
      // pointer-events-none layers (this strip, header, backdrop) are skipped.
      const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 1);
      setColor(backgroundAt(hit)); // React bails out when the string is unchanged
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // After a tap, wait a tick so e.g. a dismissed cookie banner is gone first.
    const onClick = () => {
      clearTimeout(timer);
      timer = window.setTimeout(schedule, 0);
    };
    update(); // also re-runs on every route change (pathname dependency)
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("click", onClick, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("click", onClick);
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Safari ignores edge elements 10px tall or less, hence the 12px floor.
  return (
    <div
      ref={ref}
      aria-hidden
      style={{ backgroundColor: color }}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[55] h-[max(12px,env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] [@media(hover:hover)]:hidden ${
        hasInset ? "" : "invisible"
      }`}
    />
  );
}

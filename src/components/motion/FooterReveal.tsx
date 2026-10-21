"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pins the footer behind the page so the content scrolls off it like a curtain.
 * Publishes its height as --footer-h so the page above can reserve that space.
 * Falls back to a normal in-flow footer when it is too tall for the viewport,
 * which would otherwise leave its top edge permanently out of reach, and on
 * touch devices (see below).
 */
export default function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const height = element.offsetHeight;
      // Touch: never pinned. A fixed footer at the bottom edge makes Safari 26
      // paint its toolbar strip in the footer's navy over white content.
      const fits =
        height <= window.innerHeight * 0.9 && !window.matchMedia("(hover: none)").matches;
      setPinned(fits);
      document.documentElement.style.setProperty(
        "--footer-h",
        fits ? `${height}px` : "0px"
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.style.setProperty("--footer-h", "0px");
    };
  }, []);

  return (
    <div ref={ref} className={pinned ? "fixed inset-x-0 bottom-0 z-0 [@media(hover:none)]:relative [@media(hover:none)]:z-10" : "relative z-10"}>
      {children}
    </div>
  );
}

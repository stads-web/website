"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling. Additionally, while the page is moving,
 * `html.is-scrolling` is set so purely ambient animations (the drifting
 * background blobs, the constellation canvas) hold still and leave the
 * main thread and GPU to the scroll itself.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    let on = false;
    const onScroll = () => {
      if (!on) {
        on = true;
        root.classList.add("is-scrolling");
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        on = false;
        root.classList.remove("is-scrolling");
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      root.classList.remove("is-scrolling");
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, anchors: true });
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

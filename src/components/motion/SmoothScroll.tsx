"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // While the page is moving, content under a resting cursor must not react:
  // every card that slides beneath the pointer would otherwise flip, tilt and
  // repaint its shadows mid-scroll. `html.is-scrolling` switches pointer events
  // off for <main> (see globals.css) until the scroll has settled.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      if (!root.classList.contains("is-scrolling")) root.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove("is-scrolling"), 140);
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

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling. Additionally, while the page is moving,
 * `html.is-scrolling` is set so purely ambient animations (the drifting
 * background blobs, the constellation canvas) hold still and leave the
 * main thread and GPU to the scroll itself.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const poppedRef = useRef(false);

  // Every new page starts at the top. Next.js only scrolls when the new
  // segment is out of view, and Lenis keeps its own scroll target, so a page
  // opened after scrolling down could stay at the old offset. Back/forward
  // keeps the browser's restored position.
  useEffect(() => {
    const onPop = () => {
      poppedRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (poppedRef.current) {
      poppedRef.current = false;
      return;
    }
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

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
    // Touch devices scroll natively; no smoothing loop needed there.
    if (window.matchMedia("(hover: none)").matches) return;

    const lenis = new Lenis({ duration: 1.1, anchors: true });
    lenisRef.current = lenis;
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

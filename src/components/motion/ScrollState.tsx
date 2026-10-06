"use client";

import { useEffect } from "react";

/**
 * Scrolling is fully native (compositor-thread, no JS in the loop). The one
 * thing done here: while the page is moving, `html.is-scrolling` is set so
 * purely ambient animations (the drifting background blobs) can hold still
 * and leave the GPU to the scroll itself.
 */
export default function ScrollState({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}

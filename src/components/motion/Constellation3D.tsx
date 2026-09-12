"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Constellation from "./Constellation";

const Constellation3DScene = dynamic(() => import("./Constellation3DScene"), {
  ssr: false,
});

/**
 * Drop-in 3D upgrade of Constellation. Deliberately used in exactly one place
 * (FinalCta) so there's only ever one WebGL context on the page at a time.
 * Falls back to the flat 2D version under reduced motion, which already
 * renders nothing extra there.
 */
export default function Constellation3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Mount the canvas once it's about to be seen; afterwards `inView` alone
    // pauses/resumes the render loop, so the WebGL context is never torn down.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion) return <Constellation />;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 h-full w-full">
      {mounted && <Constellation3DScene active={inView} />}
    </div>
  );
}

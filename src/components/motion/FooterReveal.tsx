"use client";

import { useEffect, useRef } from "react";

/**
 * Pins the footer behind the page so the content scrolls off it like a curtain.
 * Publishes its height as --footer-h so the page above can reserve that space.
 */
export default function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--footer-h",
        `${element.offsetHeight}px`
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-0">
      {children}
    </div>
  );
}

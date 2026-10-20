"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GalleryData } from "@/lib/types";

const STEP_MS = 3500;
const RESUME_MS = 5000;

/** Swipeable photo strip, phones and tablets only (CSS scroll-snap) with gentle autoplay. */
export default function Gallery({ data }: { data: GalleryData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ul = listRef.current;
    if (!section || !ul) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let touching = false;
    let pausedUntil = 0;

    // Scroll position that centres card i (matches snap-center).
    const target = (i: number) => {
      const card = ul.children[i] as HTMLElement;
      const u = ul.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      return ul.scrollLeft + (c.left - u.left) - (ul.clientWidth - c.width) / 2;
    };

    const tick = () => {
      if (!visible || touching || document.hidden || Date.now() < pausedUntil) return;
      const n = ul.children.length;
      if (n < 2) return;
      // Current index = card whose centring position is nearest to the real scroll position.
      let cur = 0;
      for (let i = 1; i < n; i++) {
        if (Math.abs(target(i) - ul.scrollLeft) < Math.abs(target(cur) - ul.scrollLeft)) cur = i;
      }
      ul.scrollTo({ left: target((cur + 1) % n), behavior: "smooth" });
    };

    const down = () => {
      touching = true;
    };
    const up = () => {
      touching = false;
      pausedUntil = Date.now() + RESUME_MS;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(section);
    ul.addEventListener("touchstart", down, { passive: true });
    ul.addEventListener("touchend", up);
    ul.addEventListener("touchcancel", up);
    const id = window.setInterval(tick, STEP_MS);

    return () => {
      window.clearInterval(id);
      io.disconnect();
      ul.removeEventListener("touchstart", down);
      ul.removeEventListener("touchend", up);
      ul.removeEventListener("touchcancel", up);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Datathon photos" className="pt-16 lg:hidden">
      <div className="mx-auto max-w-content">
        <ul ref={listRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-10 pt-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.items.map((item) => (
            <li
              key={item.image}
              className="relative aspect-[4/3] w-[80vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-[32px] border border-white/60 shadow-[0px_15px_30px_rgba(0,0,0,0.06),0px_30px_60px_rgba(0,0,0,0.12)]"
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="80vw"
                loading="lazy"
                className="object-cover"
                style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

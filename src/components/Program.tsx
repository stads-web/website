"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "./motion/Reveal";
import SectionHeading from "./motion/SectionHeading";
import Spotlight from "./motion/Spotlight";
import type { ProgramData, ProgramItem } from "@/lib/types";

const COLUMN_OFFSETS = ["sm:mt-[121px]", "sm:mt-0", "sm:mt-[76px]"];
const TILT = 7;
const DRIFT = ["-70px", "55px", "-35px"];

function ProgramCard({ item }: { item: ProgramItem }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Hover capability is read per event: a laptop with a touchscreen can be either.
  const canHover = () => window.matchMedia("(hover: hover)").matches;

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(rotateXRaw, spring);
  const rotateY = useSpring(rotateYRaw, spring);

  const showsBack = hovered || flipped;

  // Pointer handling lives on this static wrapper, never on the rotating card:
  // a card that flips away from under the cursor used to drop its own hover
  // and flip straight back, which read as flicker and missed clicks.
  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * TILT * 2);
    rotateXRaw.set(-py * TILT * 2);
  };

  const onEnter = () => {
    if (canHover()) setHovered(true);
  };

  const reset = () => {
    setHovered(false);
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  // Mouse: hover flips, nothing else to do. Touch and keyboard: activating toggles.
  const onActivate = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (canHover() && event.detail !== 0) return;
    setFlipped((v) => !v);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={reset}
      className="group relative [perspective:1400px]"
    >
      {/* The stronger hover shadow is a static layer that only fades in.
          Transitioning box-shadow itself repaints a 90px blur every frame. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden rounded-[40px] opacity-0 shadow-[0px_10px_20px_rgba(15,29,54,0.08),0px_25px_50px_rgba(15,29,54,0.10),0px_45px_90px_rgba(15,29,54,0.14)] transition-opacity duration-700 sm:block sm:group-hover:opacity-100"
      />
      <motion.button
        type="button"
        onClick={onActivate}
        aria-pressed={showsBack}
        aria-label={`${item.title} - flip card`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative block h-[220px] w-full shrink-0 text-left sm:h-[380px]"
      >
        <div
          className={`relative h-full w-full rounded-[28px] shadow-[0px_2px_6px_rgba(15,29,54,0.06)] transition-transform duration-700 [transform-style:preserve-3d] sm:rounded-[40px] sm:shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)] ${
            showsBack ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/60 bg-brand-50 p-4 [backface-visibility:hidden] sm:rounded-[40px] sm:p-5">
            <div className="relative h-[60%] w-full overflow-hidden rounded-[16px] border border-white/60 sm:rounded-[20px]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 640px) 340px, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </div>
            <div className="mt-2.5 sm:mt-4">
              <p className="text-sm font-medium text-brand-900 sm:text-lg">{item.title}</p>
              <span className="mt-1 inline-block text-[11px] text-brand-900/50 sm:mt-2 sm:text-[13px]">
                Tap to flip
              </span>
            </div>
            <Spotlight />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-white/60 bg-brand-800 p-5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-[40px] sm:p-8">
            <p className="text-sm font-medium text-white sm:text-lg">{item.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/80 sm:mt-3 sm:text-sm">
              {item.description}
            </p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

export default function Program({ data }: { data: ProgramData }) {
  const columns = [
    data.items.slice(0, 2),
    data.items.slice(2, 4),
    data.items.slice(4, 6),
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our program"
          title={data.title}
          accent={data.titleAccent}
          className="max-w-3xl"
        />

        <div className="mt-10 flex flex-col gap-3 sm:mt-16 sm:flex-row sm:items-start sm:gap-[29px]">
          {columns.map((col, i) => (
            // The columns drift at different speeds as the section passes - a CSS
            // scroll-driven animation (see .scroll-drift), so no JS runs per frame.
            <div
              key={i}
              style={{ "--drift": DRIFT[i] } as React.CSSProperties}
              className={`scroll-drift flex flex-1 flex-col gap-3 sm:gap-5 ${COLUMN_OFFSETS[i]}`}
            >
              {col.map((item, j) => (
                <Reveal key={item.title} delay={j * 0.08}>
                  <ProgramCard item={item} />
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

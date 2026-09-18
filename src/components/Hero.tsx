"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Magnetic from "./motion/Magnetic";
import type { HeroData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

// Depth (translateZ) for each layer inside the shared perspective container -
// photo recedes, the logo pops forward off it, the headline sits closest to
// the viewer. Only meaningful once `usePointerTilt` actually enables tilt.
const PHOTO_DEPTH = -40;
const LOGO_DEPTH = 60;
const HEADLINE_DEPTH = 90;
const TILT_MAX_DEG = 3;

/**
 * Desktop-only pointer tilt for the hero's 3D layers. Mirrors the
 * `usePointerFollow` convention in MeshBackdrop.tsx: a plain mousemove
 * listener feeding motion values through a spring. Gated the same way
 * Program.tsx gates its card tilt (`hover: hover` + `pointer: fine`), plus
 * a reduced-motion check like MeshBackdrop. `enabled` stays false until the
 * effect confirms a fine pointer, so touch/mobile never pays for the
 * perspective/translateZ styles at all - they just keep today's scroll
 * parallax.
 */
function usePointerTilt(maxDeg: number) {
  const [enabled, setEnabled] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = fine.matches && !reduced.matches;
    setEnabled(active);
    if (!active) return;

    const onMove = (event: MouseEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      ry.set(nx * maxDeg * 2);
      rx.set(-ny * maxDeg * 2);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [maxDeg, rx, ry]);

  return { enabled, rotateX, rotateY };
}

/**
 * Below Tailwind's `sm` breakpoint the full entrance choreography (LineReveal
 * + staggered fade-ins) reads as a load stall, so we compress delays/
 * durations there. Desktop timing is untouched (factor stays 1).
 */
function useCompactMotion() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

/** One headline line that wipes up behind its own mask. */
function LineReveal({
  children,
  delay,
  duration,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  duration: number;
  className: string;
}) {
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({
  data,
  subtext,
}: {
  data: HeroData;
  subtext: string;
}) {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const { enabled: tiltEnabled, rotateX, rotateY } = usePointerTilt(TILT_MAX_DEG);

  // Mobile entrance timing: compress the stagger to roughly a third of its
  // desktop length so the hero is fully legible well under a second after
  // paint, instead of ~1.5s+. Proportions stay the same, just faster.
  const compact = useCompactMotion();
  const s = compact ? 0.45 : 1;

  return (
    <section>
      <div
        style={tiltEnabled ? { perspective: 1400 } : undefined}
        className={tiltEnabled ? "[transform-style:preserve-3d]" : undefined}
      >
        <div
          ref={photoRef}
          className="relative h-[280px] w-full overflow-hidden sm:h-[380px] md:h-[480px]"
        >
          <motion.div
            style={
              tiltEnabled
                ? { y: photoY, rotateX, rotateY, z: PHOTO_DEPTH }
                : { y: photoY }
            }
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE }}
              className="relative h-[116%] w-full"
            >
              <Image
                src={data.headerImage}
                alt={data.headerImageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

          <motion.div
            style={
              tiltEnabled
                ? { y: logoY, opacity: logoOpacity, rotateX, rotateY, z: LOGO_DEPTH }
                : { y: logoY, opacity: logoOpacity }
            }
            className="absolute inset-x-0 top-24 flex justify-center px-4 sm:top-28"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 * s, ease: EASE, delay: 0.35 * s }}
            >
              <Image
                src="/images/logo_hero.webp"
                alt="STADS - Students' Association for Data Analytics & Statistics"
                width={658}
                height={205}
                priority
                className="h-auto w-[220px] sm:w-[280px] md:w-[330px]"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
          <motion.div
            style={
              tiltEnabled ? { rotateX, rotateY, z: HEADLINE_DEPTH } : undefined
            }
            className="relative inline-block"
          >
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1 * s, ease: EASE, delay: 0.55 * s }}
              className="absolute -left-16 bottom-2 hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              >
                <Image
                  src="/images/stads_mark.webp"
                  alt=""
                  width={76}
                  height={76}
                  className="h-12 w-12 xl:h-14 xl:w-14"
                />
              </motion.div>
            </motion.div>
            <h1 className="text-balance text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px]">
              <LineReveal
                delay={0.15 * s}
                duration={0.95 * s}
                className="bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-thin italic text-transparent"
              >
                {data.taglineAccent}
              </LineReveal>
              <LineReveal
                delay={0.3 * s}
                duration={0.95 * s}
                className="bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-bold text-transparent"
              >
                {data.taglineBold}
              </LineReveal>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 * s, ease: EASE, delay: 0.6 * s }}
            className="mx-auto mt-6 max-w-xl text-balance text-brand-900/70"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 * s, ease: EASE, delay: 0.72 * s }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Magnetic>
              <Link
                href={data.primaryCta.href}
                className="block rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
              >
                {data.primaryCta.label}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href={data.secondaryCta.href}
                className="block rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
              >
                {data.secondaryCta.label}
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

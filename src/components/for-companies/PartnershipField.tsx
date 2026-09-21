"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const PER_SIDE = 14;

type Dot = { x: number; y: number; r: number; side: "left" | "right" };

/** Deterministic pseudo-random so the layout is stable between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildDots(): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < PER_SIDE; i++) {
    dots.push({
      x: 2 + rand(i + 1) * 36,
      y: 6 + rand(i + 101) * 88,
      r: 0.5 + rand(i + 301) * 0.9,
      side: "left",
    });
  }
  for (let i = 0; i < PER_SIDE; i++) {
    dots.push({
      x: 62 + rand(i + 501) * 36,
      y: 6 + rand(i + 601) * 88,
      r: 0.5 + rand(i + 701) * 0.9,
      side: "right",
    });
  }
  return dots;
}

/** Every other left-side dot bridges to its nearest right-side dot - about
 * half the field connects, so it reads as an emerging network rather than
 * a solid, cluttered mesh. */
function buildLinks(dots: Dot[]) {
  const left = dots.filter((d) => d.side === "left");
  const right = dots.filter((d) => d.side === "right");
  return left
    .filter((_, i) => i % 2 === 0)
    .map((d) => {
      let best = right[0];
      let bestDist = Infinity;
      for (const r of right) {
        const dist = Math.hypot(d.x - r.x, d.y - r.y);
        if (dist < bestDist) {
          bestDist = dist;
          best = r;
        }
      }
      return { a: d, b: best };
    });
}

const DOTS = buildDots();
const LINKS = buildLinks(DOTS);

/**
 * The hero's signature visual: two loose fields of points - students on the
 * left, companies on the right - with a network of bridges drawing itself in
 * between them. Deliberately literal (not abstract decoration): it's the
 * page's actual thesis, "we connect the two," rendered instead of stated.
 *
 * Plain SVG rather than canvas/WebGL - this only needs to draw once on
 * mount, so there's no reason to take on animation-loop/GL complexity for a
 * static field that just eases in.
 */
export default function PartnershipField({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
    >
      {LINKS.map((link, i) => (
        <motion.line
          key={`link-${i}`}
          x1={link.a.x}
          y1={link.a.y}
          x2={link.b.x}
          y2={link.b.y}
          stroke="#A8B7D1"
          strokeOpacity={0.3}
          strokeWidth={0.12}
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5 + i * 0.05, ease: EASE }}
        />
      ))}
      {DOTS.map((dot, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={dot.side === "left" ? "#A8B7D1" : "#7388B0"}
          initial={reduced ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.02, ease: EASE }}
        />
      ))}
    </svg>
  );
}

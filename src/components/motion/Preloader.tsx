"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "stads-preloader-shown";

// Timings sum to a short, premium reveal (~1.25s) including the exit fade.
const CONVERGE_MS = 750;
const HOLD_MS = 150;
const EXIT_S = 0.35;

type Particle = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: number;
};

/** easeOutBack - slight overshoot so the ring "settles" into place. */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Ring radius, as a fraction of min(width, height). On desktop-sized
 * viewports this is the original 0.09. Below ~900px it scales up toward
 * 0.16 so the ring still reads as a confident focal point on phones,
 * where min(w,h) (e.g. 375 on a 375x812 screen) would otherwise shrink it
 * to a barely-visible mark.
 */
function ringRadiusScale(minDimension: number) {
  const DESKTOP_MIN = 900;
  const PHONE_MIN = 480;
  const DESKTOP_SCALE = 0.09;
  const PHONE_SCALE = 0.16;
  if (minDimension >= DESKTOP_MIN) return DESKTOP_SCALE;
  if (minDimension <= PHONE_MIN) return PHONE_SCALE;
  const t = (DESKTOP_MIN - minDimension) / (DESKTOP_MIN - PHONE_MIN);
  return DESKTOP_SCALE + t * (PHONE_SCALE - DESKTOP_SCALE);
}

/**
 * One-time, per-tab intro: a scatter of points draws itself into the STADS
 * ring mark, then the whole overlay fades to reveal the real page beneath.
 * Gated on sessionStorage so it never replays on internal navigation, and
 * skipped entirely under prefers-reduced-motion.
 */
export default function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  // Decide once, synchronously on mount, whether this tab/session gets the intro.
  useEffect(() => {
    try {
      const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      sessionStorage.setItem(STORAGE_KEY, "1");
      if (alreadyShown || reduced) return;
      setShouldRender(true);
      setVisible(true);
    } catch {
      // sessionStorage unavailable (e.g. locked-down privacy mode) - just skip.
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let start = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = width / 2;
      const cy = height / 2;
      const minDimension = Math.min(width, height);
      const r = minDimension * ringRadiusScale(minDimension);
      const count = 42;

      particles = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const scatterR = r * (2.5 + Math.random() * 4);
        const scatterAngle = angle + (Math.random() - 0.5) * 1.4;
        return {
          x: 0,
          y: 0,
          sx: cx + Math.cos(scatterAngle) * scatterR,
          sy: cy + Math.sin(scatterAngle) * scatterR,
          tx: cx + Math.cos(angle) * r,
          ty: cy + Math.sin(angle) * r,
          delay: Math.random() * 180,
        };
      });
    };

    const draw = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      context.clearRect(0, 0, width, height);

      for (const p of particles) {
        const t = Math.min(1, Math.max(0, (elapsed - p.delay) / (CONVERGE_MS - 180)));
        const eased = easeOutBack(t);
        p.x = p.sx + (p.tx - p.sx) * eased;
        p.y = p.sy + (p.ty - p.sy) * eased;

        context.beginPath();
        context.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        context.fillStyle = `rgba(231,236,244,${0.45 + 0.55 * t})`;
        context.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    const holdTimer = setTimeout(() => setVisible(false), CONVERGE_MS + HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      clearTimeout(holdTimer);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-brand-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_S, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <canvas ref={canvasRef} className="h-full w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

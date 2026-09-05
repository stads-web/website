"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

type Point = { targets: { x: number; y: number }[]; r: number; cluster: number };

const COUNT = 110;
const PHASES = 4;
const COLORS = ["#A8B7D1", "#8A9DBE", "#7388B0", "#CBD6E7"];

/** Deterministic pseudo-random so the layout is stable between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function buildPoints(): Point[] {
  const centres = [
    { x: 0.26, y: 0.34 },
    { x: 0.7, y: 0.3 },
    { x: 0.5, y: 0.74 },
  ];

  return Array.from({ length: COUNT }, (_, i) => {
    const a = rand(i + 1);
    const b = rand(i + 101);
    const c = rand(i + 211);
    const cluster = i % 3;
    const centre = centres[cluster];

    // 0: noise, 1: a correlation emerges, 2: clusters form, 3: it converges
    return {
      cluster,
      r: 1.4 + c * 1.8,
      targets: [
        { x: 0.06 + a * 0.88, y: 0.08 + b * 0.84 },
        { x: 0.08 + a * 0.84, y: 0.82 - a * 0.62 + (b - 0.5) * 0.22 },
        {
          x: centre.x + (a - 0.5) * 0.24,
          y: centre.y + (b - 0.5) * 0.26,
        },
        {
          x: 0.5 + (a - 0.5) * 0.5,
          y: 0.52 + (b - 0.5) * 0.34 - (a - 0.5) * 0.18,
        },
      ],
    };
  });
}

/**
 * The visual spine of the weekend: a point cloud that moves from raw noise to
 * a fitted, clustered result as the section scrolls. Replaces the photo
 * sequence - the story is the data, not a stock shot per phase.
 */
export default function DataCanvas({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const points = buildPoints();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const p = reduced ? 0.55 : Math.min(1, Math.max(0, progress.get()));
      const t = p * (PHASES - 1);
      const index = Math.min(PHASES - 2, Math.floor(t));
      const blend = smoothstep(t - index);

      const padX = width * 0.06;
      const padY = height * 0.08;
      const innerW = width - padX * 2;
      const innerH = height - padY * 2;

      ctx.clearRect(0, 0, width, height);

      const resolved = points.map((point) => {
        const from = point.targets[index];
        const to = point.targets[index + 1];
        return {
          x: padX + (from.x + (to.x - from.x) * blend) * innerW,
          y: padY + (from.y + (to.y - from.y) * blend) * innerH,
          r: point.r,
          cluster: point.cluster,
        };
      });

      // The trend line writes itself in while the correlation phase holds.
      const lineIn = Math.min(1, Math.max(0, (p - 0.22) / 0.16));
      const lineOut = Math.min(1, Math.max(0, (p - 0.52) / 0.18));
      const lineAlpha = lineIn * (1 - lineOut) * 0.7;
      if (lineAlpha > 0.01) {
        const x1 = padX + 0.08 * innerW;
        const y1 = padY + 0.82 * innerH;
        const x2 = padX + 0.92 * innerW;
        const y2 = padY + 0.2 * innerH;
        ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * lineIn, y1 + (y2 - y1) * lineIn);
        ctx.stroke();
      }

      // Cluster links only make sense once the groups have separated.
      const linkAlpha = Math.min(1, Math.max(0, (p - 0.52) / 0.2)) *
        (1 - Math.min(1, Math.max(0, (p - 0.85) / 0.15)));
      if (linkAlpha > 0.01) {
        for (let i = 0; i < resolved.length; i++) {
          for (let j = i + 1; j < resolved.length; j++) {
            if (resolved[i].cluster !== resolved[j].cluster) continue;
            const dx = resolved[i].x - resolved[j].x;
            const dy = resolved[i].y - resolved[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist > 90) continue;
            ctx.strokeStyle = `rgba(115,136,176,${linkAlpha * 0.35 * (1 - dist / 90)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(resolved[i].x, resolved[i].y);
            ctx.lineTo(resolved[j].x, resolved[j].y);
            ctx.stroke();
          }
        }
      }

      for (const point of resolved) {
        const colour = COLORS[point.cluster % COLORS.length];
        // Halo first, then a crisp core - cheaper than a canvas shadow blur.
        ctx.fillStyle = colour;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r * 3.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [progress]);

  return <canvas ref={ref} aria-hidden className={className} />;
}

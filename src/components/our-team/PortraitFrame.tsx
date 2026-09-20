"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Shallow on purpose - this is a photo tile easing back on hover, not the
// flip-card tilt Program.tsx uses. Kept well under Program's TILT so the
// two never read as the same trick reused.
const TILT = 8;
const OVERSCAN = 1.1;

/**
 * Shows a real portrait once one exists, and a designed monogram panel until
 * then - so a missing photo reads as intentional rather than broken.
 *
 * On pointer-capable displays the tile leans a few degrees toward the
 * cursor, like a shallow pane set into a depth wall (mirrors the tilt
 * technique in Program.tsx, gated the same way). The content is rendered
 * slightly oversized so that lean never uncovers an edge against its
 * clipping frame. Touch devices and prefers-reduced-motion get back the
 * exact flat, static tile below - no listener is ever attached and the
 * pointer math never runs.
 *
 * `onTilt` mirrors the raw (pre-spring) tilt target out to a parent that
 * wants a second depth layer - e.g. a caption plate - to lean in sync.
 */
export default function PortraitFrame({
  photo,
  name,
  initials,
  onTilt,
}: {
  photo?: string;
  name: string;
  initials: string;
  onTilt?: (rotateX: number, rotateY: number) => void;
}) {
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanTilt(hover.matches && !reduced.matches);
    update();
    hover.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 200, damping: 22, mass: 0.4 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nextRy = ((event.clientX - rect.left) / rect.width - 0.5) * TILT;
    const nextRx = -((event.clientY - rect.top) / rect.height - 0.5) * TILT;
    ry.set(nextRy);
    rx.set(nextRx);
    onTilt?.(nextRx, nextRy);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    onTilt?.(0, 0);
  };

  const content = photo ? (
    <div className="absolute inset-0">
      <Image
        src={photo}
        alt={name}
        fill
        sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
      />
    </div>
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950">
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[5.5rem] font-medium tracking-tight text-white/[0.09]"
      >
        {initials}
      </span>
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-950/80 to-transparent"
      />
    </div>
  );

  if (!canTilt) {
    return content;
  }

  return (
    <div className="absolute inset-0 [perspective:1000px]">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, scale: OVERSCAN }}
        className="absolute inset-0"
      >
        {content}
      </motion.div>
    </div>
  );
}

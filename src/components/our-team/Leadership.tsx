"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import Spotlight from "../motion/Spotlight";
import PortraitFrame from "./PortraitFrame";
import type { LeadershipData, TeamMember } from "@/lib/types";

// The caption plate sits further from the wall than the photo, so under the
// same lean (mirrored from PortraitFrame via onTilt) it sweeps a wider arc -
// real parallax from one shared perspective, not a second copy of the tilt
// math with bigger numbers.
const PLATE_DEPTH = 46;

/** True only where PortraitFrame would itself tilt - see its own doc comment. */
function useCanElevate() {
  const [canElevate, setCanElevate] = useState(false);
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanElevate(hover.matches && !reduced.matches);
    update();
    hover.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);
  return canElevate;
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const canElevate = useCanElevate();

  const capRx = useMotionValue(0);
  const capRy = useMotionValue(0);
  const spring = { stiffness: 200, damping: 22, mass: 0.4 };
  const captionRotateX = useSpring(capRx, spring);
  const captionRotateY = useSpring(capRy, spring);
  const captionTransform = useMotionTemplate`rotateX(${captionRotateX}deg) rotateY(${captionRotateY}deg) translateZ(${PLATE_DEPTH}px)`;

  const handleTilt = (rotX: number, rotY: number) => {
    capRx.set(rotX);
    capRy.set(rotY);
  };

  // Touch and prefers-reduced-motion get the exact flat tile: a single
  // clipped card with the caption printed straight onto the photo, no
  // plate, no perspective, no tilt listeners.
  if (!canElevate) {
    return (
      <Reveal delay={0.1 * index}>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[32px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]">
          <PortraitFrame
            photo={member.photo}
            name={member.name}
            initials={member.initials}
          />
          <Spotlight />

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              {member.role}
            </p>
            <p className="mt-2 text-2xl font-medium text-white">{member.name}</p>
            <span className="mt-4 block h-px w-10 origin-left bg-white/30 transition-transform duration-500 group-hover:scale-x-[2.4]" />
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={0.1 * index}>
      <div className="[perspective:1200px]">
        <div className="group relative aspect-[4/5]">
          <div className="absolute inset-0 overflow-hidden rounded-[32px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]">
            <PortraitFrame
              photo={member.photo}
              name={member.name}
              initials={member.initials}
              onTilt={handleTilt}
            />
            <Spotlight />
          </div>

          <motion.div
            style={{ transform: captionTransform }}
            className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[22px] border border-white/10 bg-brand-950/85 p-5 shadow-[0px_4px_10px_rgba(15,29,54,0.18),0px_16px_32px_rgba(15,29,54,0.24)] backdrop-blur-md"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              {member.role}
            </p>
            <p className="mt-2 text-2xl font-medium text-white">{member.name}</p>
            <span className="mt-4 block h-px w-10 origin-left bg-white/30 transition-transform duration-500 group-hover:scale-x-[2.4]" />
          </motion.div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Leadership({ data }: { data: LeadershipData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
      <SectionHeading
        eyebrow={data.eyebrow}
        title={data.title}
        intro={data.intro}
        align="center"
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
        {data.members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import Spotlight from "../motion/Spotlight";
import PortraitFrame from "./PortraitFrame";
import type { LeadershipData, TeamMember } from "@/lib/types";

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 200, damping: 22, mass: 0.4 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set(((event.clientX - rect.left) / rect.width - 0.5) * 9);
    rx.set(-((event.clientY - rect.top) / rect.height - 0.5) * 9);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Reveal delay={0.1 * index}>
      <div className="[perspective:1200px]">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX, rotateY }}
          className="group relative aspect-[4/5] overflow-hidden rounded-[32px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]"
        >
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
        </motion.div>
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

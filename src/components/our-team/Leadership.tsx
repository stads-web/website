"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import Spotlight from "../motion/Spotlight";
import type { LeadershipData, TeamMember } from "@/lib/types";

const GRADIENTS = [
  "from-brand-400 to-brand-700",
  "from-brand-500 to-brand-900",
  "from-brand-300 to-brand-600",
];

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
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
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-brand-50 p-8 text-center shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]"
        >
          <Spotlight />
          <div
            className={`relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-medium text-white shadow-lg ${GRADIENTS[index % GRADIENTS.length]}`}
            style={{ transform: "translateZ(40px)" }}
          >
            {member.initials}
          </div>
          <p
            className="relative mt-5 text-lg font-medium text-brand-900"
            style={{ transform: "translateZ(30px)" }}
          >
            {member.name}
          </p>
        </motion.div>
      </div>
    </Reveal>
  );
}

export default function Leadership({ data }: { data: LeadershipData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-10">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-500">
          {data.eyebrow}
        </p>
      </Reveal>
      <h2 className="mt-2 text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
        <SplitText text={data.title} delay={0.1} />
      </h2>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
        {data.members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </section>
  );
}

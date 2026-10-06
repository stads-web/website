"use client";

import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import Spotlight from "../motion/Spotlight";
import PortraitFrame from "./PortraitFrame";
import NameTag from "./NameTag";
import type { LeadershipData, TeamMember } from "@/lib/types";

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal delay={0.1 * index}>
      <div className="group mx-auto w-full max-w-[340px] sm:max-w-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]">
          <PortraitFrame
            photo={member.photo}
            name={member.name}
            initials={member.initials}
          />
          <Spotlight />
        </div>

        {/* Caption sits under the portrait so the person is never covered. */}
        <NameTag name={member.name} role={member.role} className="mt-5" />
      </div>
    </Reveal>
  );
}

export default function Leadership({ data }: { data: LeadershipData }) {
  return (
    <section id="board" className="mx-auto max-w-content scroll-mt-24 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
      <SectionHeading
        eyebrow={data.eyebrow}
        title={data.title}
        intro={data.intro}
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-12 sm:grid-cols-3 sm:gap-6">
        {data.members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </section>
  );
}

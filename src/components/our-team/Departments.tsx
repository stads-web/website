"use client";

import { useState } from "react";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "./PortraitFrame";
import { iconMap } from "@/lib/icons";
import type { Department, DepartmentsData } from "@/lib/types";

function DepartmentCard({ dept, index }: { dept: Department; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = iconMap[dept.icon];

  return (
    <Reveal delay={0.05 * index}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${dept.name} - what this team does`}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] border border-brand-100 text-left shadow-[0px_10px_20px_rgba(15,29,54,0.05),0px_30px_60px_rgba(15,29,54,0.08)]"
      >
        <PortraitFrame photo={dept.photo} name={dept.name} initials={dept.initials} />

        <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
          {Icon && <Icon size={18} weight="bold" aria-hidden="true" />}
        </span>
        <span className="absolute right-5 top-5 font-mono text-[11px] text-white/40">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-2xl font-medium text-white">{dept.name}</p>
          {dept.lead ? (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
              {dept.lead}
            </p>
          ) : (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
              Department lead
            </p>
          )}
        </div>

        {/* Full description rides up on hover, and on tap for touch devices. */}
        <div
          className={`absolute inset-0 flex flex-col justify-end bg-brand-950/94 p-6 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="text-xl font-medium text-white">{dept.name}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/70">{dept.text}</p>
        </div>
      </button>
    </Reveal>
  );
}

export default function Departments({ data }: { data: DepartmentsData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.items.map((dept, i) => (
          <DepartmentCard key={dept.name} dept={dept} index={i} />
        ))}
      </div>
    </section>
  );
}

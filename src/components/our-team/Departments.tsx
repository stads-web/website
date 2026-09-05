"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "./PortraitFrame";
import { iconMap } from "@/lib/icons";
import type { Department, DepartmentsData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function LeadLine({ lead }: { lead?: string }) {
  if (lead) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-500">
        {lead}
      </p>
    );
  }
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-300">
      Department lead
    </p>
  );
}

/** Stacked cards for narrow screens - no hover to rely on, no overlap. */
function StackedDepartments({ items }: { items: Department[] }) {
  return (
    <div className="mt-12 flex flex-col gap-10 lg:hidden">
      {items.map((dept, i) => {
        const Icon = iconMap[dept.icon];
        return (
          <Reveal key={dept.name} delay={0.05 * i}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-brand-100">
              <PortraitFrame
                photo={dept.photo}
                name={dept.name}
                initials={dept.initials}
              />
              <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
                {Icon && <Icon size={18} weight="bold" aria-hidden="true" />}
              </span>
              <span className="absolute right-5 top-5 font-mono text-[11px] text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-5 text-2xl font-medium text-brand-900">{dept.name}</p>
            <div className="mt-1">
              <LeadLine lead={dept.lead} />
            </div>
            <p className="mt-3 leading-relaxed text-brand-900/70">{dept.text}</p>
          </Reveal>
        );
      })}
    </div>
  );
}

export default function Departments({ data }: { data: DepartmentsData }) {
  const [active, setActive] = useState(0);
  const current = data.items[active];
  const CurrentIcon = iconMap[current.icon];

  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <StackedDepartments items={data.items} />

      <div className="mt-14 hidden gap-16 lg:grid lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]">
            {/* All portraits stay mounted and cross-fade by opacity. Swapping a
                keyed child through AnimatePresence let rapid hovers strand a
                stale entry on screen. */}
            {data.items.map((dept, i) => (
              <div
                key={dept.name}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <PortraitFrame
                  photo={dept.photo}
                  name={dept.name}
                  initials={dept.initials}
                />
              </div>
            ))}

            <span className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
              {CurrentIcon && <CurrentIcon size={20} weight="bold" aria-hidden="true" />}
            </span>
            <span className="absolute right-6 top-6 font-mono text-xs text-white/40">
              {String(active + 1).padStart(2, "0")} / {String(data.items.length).padStart(2, "0")}
            </span>
          </div>

          {/* Keyed remount, no presence queue - the copy can never lag behind
              the portrait it belongs to. */}
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-6"
          >
            <LeadLine lead={current.lead} />
            <p className="mt-2 text-3xl font-medium text-brand-900">{current.name}</p>
            <p className="mt-4 leading-relaxed text-brand-900/70">{current.text}</p>
          </motion.div>
        </div>

        <ul className="border-t border-brand-100">
          {data.items.map((dept, i) => {
            const Icon = iconMap[dept.icon];
            const selected = i === active;
            return (
              <li key={dept.name} className="relative border-b border-brand-100">
                {selected && (
                  <motion.span
                    layoutId="department-active"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 rounded-lg bg-brand-50"
                  />
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={selected}
                  className="relative flex w-full items-center gap-5 px-4 py-6 text-left"
                >
                  <span className="font-mono text-[11px] text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      selected ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800"
                    }`}
                  >
                    {Icon && (
                      <Icon size={18} weight={selected ? "fill" : "regular"} aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`flex-1 text-2xl font-medium transition-colors duration-300 ${
                      selected ? "text-brand-900" : "text-brand-900/45"
                    }`}
                  >
                    {dept.name}
                  </span>
                  <span
                    className={`h-px transition-all duration-500 ${
                      selected ? "w-12 bg-brand-800" : "w-5 bg-brand-200"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "./PortraitFrame";
import { iconMap } from "@/lib/icons";
import type { Department, DepartmentsData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Glass plate printed onto the portrait: who leads the department. */
function LeadPlate({ lead, compact = false }: { lead?: string; compact?: boolean }) {
  if (!lead) return null;
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/70 via-brand-950/25 to-transparent ${
        compact ? "p-4 pt-16" : "p-5 pt-24"
      }`}
    >
      <div
        className={`rounded-[18px] border border-white/15 bg-brand-950/55 backdrop-blur-md ${
          compact ? "px-4 py-3" : "px-5 py-4"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
          Department lead
        </p>
        <p className={`mt-1.5 font-medium text-white ${compact ? "text-lg" : "text-xl"}`}>
          {lead}
        </p>
        <span className="mt-3 block h-px w-8 bg-white/30" />
      </div>
    </div>
  );
}

/**
 * Narrow screens: the same index list as desktop, but each row opens inline
 * and carries its own portrait. One row open at a time; tapping scrolls the
 * opened row back under the header so the collapse above never throws the
 * reader off.
 */
function AccordionDepartments({ items }: { items: Department[] }) {
  const [open, setOpen] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next === -1) return;
    window.setTimeout(() => {
      const el = rows.current[next];
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < 84 || top > window.innerHeight * 0.55) {
        window.scrollTo({ top: window.scrollY + top - 84, behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <ul className="mt-10 border-t border-brand-100 lg:hidden">
      {items.map((dept, i) => {
        const Icon = iconMap[dept.icon];
        const isOpen = i === open;
        return (
          <li
            key={dept.name}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="relative border-b border-brand-100"
          >
            {isOpen && (
              <motion.span
                layoutId="department-active-mobile"
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0 rounded-lg bg-brand-50"
              />
            )}
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`dept-panel-${i}`}
              className="relative flex w-full items-center gap-3.5 px-3 py-5 text-left sm:gap-5 sm:px-4"
            >
              <span className="w-5 shrink-0 font-mono text-[11px] text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  isOpen ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800"
                }`}
              >
                {Icon && <Icon size={18} weight={isOpen ? "fill" : "regular"} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[1.4rem] font-medium leading-tight transition-colors duration-300 ${
                    isOpen ? "text-brand-900" : "text-brand-900/55"
                  }`}
                >
                  {dept.name}
                </span>
                {dept.lead && (
                  <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500">
                    {dept.lead}
                  </span>
                )}
              </span>
              <Plus
                size={18}
                weight="regular"
                aria-hidden="true"
                className={`shrink-0 text-brand-400 transition-transform duration-500 ${
                  isOpen ? "rotate-[135deg] text-brand-800" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`dept-panel-${i}`}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative overflow-hidden"
                >
                  <div className="grid gap-6 px-3 pb-7 pt-1 sm:grid-cols-[minmax(0,300px)_1fr] sm:items-start sm:gap-8 sm:px-4">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-brand-100 shadow-[0px_10px_20px_rgba(15,29,54,0.06),0px_30px_60px_rgba(15,29,54,0.10)]">
                      <PortraitFrame
                        photo={dept.photo}
                        name={`${dept.name} – ${dept.lead ?? "STADS"}`}
                        initials={dept.initials}
                      />
                      <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
                        {Icon && <Icon size={18} weight="bold" aria-hidden="true" />}
                      </span>
                      <span className="absolute right-5 top-5 font-mono text-[11px] text-white/45">
                        {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </span>
                      <LeadPlate lead={dept.lead} compact />
                    </div>
                    <p className="text-[1.05rem] leading-relaxed text-brand-900/70 sm:pt-2">
                      {dept.text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export default function Departments({ data }: { data: DepartmentsData }) {
  const [active, setActive] = useState(0);
  const current = data.items[active];
  const CurrentIcon = iconMap[current.icon];

  return (
    <section id="departments" className="mx-auto max-w-content scroll-mt-24 px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <AccordionDepartments items={data.items} />

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
                  name={`${dept.name} – ${dept.lead ?? "STADS"}`}
                  initials={dept.initials}
                />
                <LeadPlate lead={dept.lead} />
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
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-brand-300">
              Department
            </p>
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
                  {dept.lead && (
                    <span
                      className={`hidden font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 xl:block ${
                        selected ? "text-brand-600" : "text-brand-300"
                      }`}
                    >
                      {dept.lead}
                    </span>
                  )}
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

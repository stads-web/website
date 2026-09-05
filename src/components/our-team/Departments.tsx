"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import { iconMap } from "@/lib/icons";
import type { Department, DepartmentsData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function DepartmentRow({
  dept,
  index,
  open,
  onToggle,
}: {
  dept: Department;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = iconMap[dept.icon];

  return (
    <Reveal delay={0.05 * index}>
      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-5 p-5 text-left sm:p-6"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              open ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800"
            }`}
          >
            {Icon && <Icon size={20} weight={open ? "fill" : "regular"} aria-hidden="true" />}
          </span>
          <span className="flex-1 text-lg font-medium text-brand-900">{dept.name}</span>
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-brand-400"
          >
            <CaretRight size={18} weight="bold" aria-hidden="true" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-6 leading-relaxed text-brand-900/70 sm:px-6 sm:pl-[4.25rem]">
                {dept.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function Departments({ data }: { data: DepartmentsData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <h2 className="text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
        <SplitText text={data.title} />
      </h2>

      <div className="mt-12 flex flex-col gap-4">
        {data.items.map((dept, i) => (
          <DepartmentRow
            key={dept.name}
            dept={dept}
            index={i}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

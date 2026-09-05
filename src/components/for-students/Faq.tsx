"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import type { FaqData } from "@/lib/types";

export default function Faq({ data }: { data: FaqData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-5">
        {data.items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-lg border border-brand-200 bg-white shadow-[0px_20px_50px_rgba(0,0,0,0.08)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 p-6 text-left sm:p-7"
              >
                <span className="text-lg font-bold text-brand-900 sm:text-xl">
                  {item.question}
                </span>
                <CaretDown
                  size={20}
                  weight="bold"
                  className={`shrink-0 text-brand-900 transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {open && (
                <p className="px-6 pb-6 leading-relaxed text-brand-900/70 sm:px-7 sm:pb-7">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProgramData, ProgramItem } from "@/lib/types";

const COLUMN_OFFSETS = ["sm:mt-[121px]", "sm:mt-0", "sm:mt-[76px]"];

function ProgramCard({ item }: { item: ProgramItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      aria-label={`${item.title} - tap to flip`}
      className="group relative block h-[340px] w-full shrink-0 text-left [perspective:1200px] sm:h-[380px]"
    >
      <div
        className={`relative h-full w-full rounded-[40px] shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)] transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[40px] border border-white/60 bg-brand-50 p-5 [backface-visibility:hidden]">
          <div className="relative h-[60%] w-full overflow-hidden rounded-[20px] border border-white/60">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(min-width: 640px) 340px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium text-brand-900">{item.title}</p>
            <span className="mt-2 inline-block text-[13px] text-brand-900/50">
              Tap to learn more
            </span>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[40px] border border-white/60 bg-brand-800 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-lg font-medium text-white">{item.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{item.description}</p>
        </div>
      </div>
    </button>
  );
}

export default function Program({ data }: { data: ProgramData }) {
  const columns = [data.items.slice(0, 2), data.items.slice(2, 4), data.items.slice(4, 6)];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
          {data.title} <span className="text-brand-500">{data.titleAccent}</span>
        </h2>

        <div className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-[29px]">
          {columns.map((col, i) => (
            <div key={i} className={`flex flex-1 flex-col gap-5 ${COLUMN_OFFSETS[i]}`}>
              {col.map((item) => (
                <ProgramCard key={item.title} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

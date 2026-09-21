"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SplitText from "../motion/SplitText";
import Magnetic from "../motion/Magnetic";
import CountUp from "../motion/CountUp";
import PartnershipField from "./PartnershipField";
import type { CompaniesHeroData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Deliberately its own thing rather than a re-run of DatathonHero's
 * photo-plus-scrim formula: no photo at all, content sits centered rather
 * than pinned to the bottom (so a longer headline can never grow tall
 * enough to creep up under the fixed header, whatever it wraps to), and the
 * stats move into their own bottom ledger instead of riding next to the
 * CTAs. The signature visual (PartnershipField) is content, not decoration.
 */
export default function CompaniesHero({ data }: { data: CompaniesHeroData }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-brand-950">
      <PartnershipField className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/10 via-brand-950/70 to-brand-950" />

      {/* pt-24 clears the fixed header's mobile pill height (~96px) with
          room to spare; min-h-0 lets this row compress instead of forcing
          the section to overflow when a short/landscape viewport can't fit
          the centered content and the stats ledger below it both. */}
      <div className="relative flex min-h-0 flex-1 items-center px-4 pt-24 sm:px-6 lg:pt-8">
        <div className="mx-auto w-full max-w-content">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="text-xs font-medium uppercase tracking-[0.4em] text-white/70 sm:text-sm"
          >
            {data.eyebrow}
          </motion.p>

          <h1 className="mt-4 max-w-3xl text-balance font-medium leading-[1.08] tracking-[-0.02em] text-white">
            <SplitText
              text={data.title}
              delay={0.35}
              className="block text-[clamp(2.25rem,5.5vw,4.25rem)]"
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
            className="mt-8 flex flex-col items-start gap-8"
          >
            <p className="max-w-md text-lg text-white/75">{data.subline}</p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href={data.primaryCta.href}
                  className="block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
                >
                  {data.primaryCta.label}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href={data.secondaryCta.href}
                  className="block rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {data.secondaryCta.label}
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.3 }}
        className="relative mx-auto flex w-full max-w-content flex-wrap justify-between gap-x-6 gap-y-3 border-t border-white/10 px-4 py-6 sm:px-6"
      >
        {data.stats.map((stat) => (
          <div key={stat.value}>
            <dt className="text-[10px] uppercase tracking-[0.24em] text-white/45">
              {stat.label || " "}
            </dt>
            <dd className="mt-1 text-xl font-medium tracking-tight text-white sm:text-2xl">
              <CountUp value={stat.value} />
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}

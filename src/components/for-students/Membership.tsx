"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import SectionHeading from "../motion/SectionHeading";
import Reveal from "../motion/Reveal";
import type { MembershipData, MembershipTier } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function TierHead({ tier }: { tier: MembershipTier }) {
  return (
    <div
      className={`rounded-2xl px-4 py-4 text-center ${
        tier.featured ? "bg-brand-800 text-white" : "bg-brand-50 text-brand-900"
      }`}
    >
      <p className="text-sm font-medium capitalize">{tier.name}</p>
      <p
        className={`mt-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
          tier.featured ? "text-white/55" : "text-brand-500"
        }`}
      >
        {tier.note}
      </p>
    </div>
  );
}

function Marker({ included, featured }: { included: boolean; featured?: boolean }) {
  if (!included) {
    return <span className="mx-auto block h-px w-4 bg-brand-200" aria-label="not included" />;
  }
  return (
    <span
      className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
        featured ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800"
      }`}
      aria-label="included"
    >
      <Check size={14} weight="bold" aria-hidden="true" />
    </span>
  );
}

export default function Membership({ data }: { data: MembershipData }) {
  const columns = data.tiers.length;

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading eyebrow="Memberships" title={data.title} intro={data.intro} />

      {/* Comparison matrix - one row per benefit, so the step up between
          tiers is readable instead of three lists you have to diff by eye. */}
      <div className="mt-14 hidden sm:block">
        <div
          className="grid items-end gap-x-4"
          style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${columns}, minmax(0,140px))` }}
        >
          <span />
          {data.tiers.map((tier) => (
            <TierHead key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="mt-2">
          {data.benefits.map((benefit, row) => (
            <motion.div
              key={benefit.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE, delay: row * 0.035 }}
              className="grid items-center gap-x-4 border-b border-brand-100 py-4 transition-colors hover:bg-brand-50/60"
              style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${columns}, minmax(0,140px))` }}
            >
              <span className="pr-4 text-brand-900">{benefit.label}</span>
              {benefit.tiers.map((included, i) => (
                <Marker
                  key={data.tiers[i].name}
                  included={included}
                  featured={data.tiers[i].featured}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Narrow screens get one card per tier - a 4-column table is unusable there. */}
      <div className="mt-12 flex flex-col gap-6 sm:hidden">
        {data.tiers.map((tier, tierIndex) => (
          <Reveal key={tier.name} delay={0.08 * tierIndex}>
            <div
              className={`rounded-[28px] p-6 ${
                tier.featured
                  ? "bg-brand-800 text-white"
                  : "border border-brand-100 bg-white text-brand-900"
              }`}
            >
              <p className="text-lg font-medium capitalize">{tier.name}</p>
              <p
                className={`mt-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  tier.featured ? "text-white/55" : "text-brand-500"
                }`}
              >
                {tier.note}
              </p>
              <ul className="mt-5 space-y-3">
                {data.benefits
                  .filter((benefit) => benefit.tiers[tierIndex])
                  .map((benefit) => (
                    <li key={benefit.label} className="flex items-start gap-3">
                      <Check
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className={`mt-1 shrink-0 ${
                          tier.featured ? "text-white/70" : "text-brand-500"
                        }`}
                      />
                      <span
                        className={
                          tier.featured ? "text-white/85" : "text-brand-900/75"
                        }
                      >
                        {benefit.label}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

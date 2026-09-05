"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitChars from "../motion/SplitChars";
import Magnetic from "../motion/Magnetic";
import type { DatathonHeroData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DatathonHero({ data }: { data: DatathonHeroData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[560px] flex-col justify-end overflow-hidden"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
          className="relative h-[122%] w-full"
        >
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-brand-950/60 to-brand-950/90" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-content px-4 pb-24 sm:px-6 sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="text-xs font-medium uppercase tracking-[0.4em] text-white/70 sm:text-sm"
        >
          {data.eyebrow}
        </motion.p>

        <h1 className="mt-3 font-medium leading-[0.86] text-white">
          <SplitChars
            text={data.title}
            delay={0.3}
            className="block text-[clamp(3.5rem,17vw,15rem)] tracking-[-0.03em]"
          />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
          className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="max-w-md text-lg text-white/80">{data.subline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
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
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Time on the clock
            </p>
            <p className="mt-1 font-mono text-3xl tabular-nums tracking-tight text-white sm:text-4xl">
              48<span className="animate-blink">:</span>00
              <span className="animate-blink">:</span>00
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

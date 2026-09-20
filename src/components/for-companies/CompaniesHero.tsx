"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitChars from "../motion/SplitChars";
import Magnetic from "../motion/Magnetic";
import CountUp from "../motion/CountUp";
import type { CompaniesHeroData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Same load-stall fix as DatathonHero's compact mode - see that file. */
function useCompactMotion() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

export default function CompaniesHero({ data }: { data: CompaniesHeroData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const compact = useCompactMotion();
  const s = compact ? 0.45 : 1;

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[560px] flex-col justify-end overflow-hidden bg-brand-950"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
          className="relative h-[118%] w-full"
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

      {/* The source photo is a bright daytime shot, unlike Datathon's dark
          one - so the scrim is weighted toward the bottom (where the
          content sits) instead of darkening the whole frame evenly. */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/55 to-brand-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-content px-4 pb-24 sm:px-6 sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 * s, ease: EASE, delay: 0.15 * s }}
          className="text-xs font-medium uppercase tracking-[0.4em] text-white/70 sm:text-sm"
        >
          {data.eyebrow}
        </motion.p>

        <h1 className="mt-3 max-w-4xl font-medium leading-[0.98] text-white">
          <SplitChars
            text={data.title}
            delay={0.3 * s}
            className="block text-[clamp(2.6rem,7vw,5.5rem)] tracking-[-0.03em]"
          />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 * s, ease: EASE, delay: 1.15 * s }}
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

          <dl className="flex shrink-0 flex-wrap gap-x-6 gap-y-3 sm:flex-nowrap sm:gap-10">
            {data.stats.map((stat) => (
              <div key={stat.value}>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                  {stat.label || " "}
                </dt>
                <dd className="mt-1 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}

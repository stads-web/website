"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";
import Magnetic from "./motion/Magnetic";
import type { HeroData } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One headline line that wipes up behind its own mask. */
function LineReveal({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className: string;
}) {
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({
  data,
  subtext,
}: {
  data: HeroData;
  subtext: string;
}) {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section>
      <div
        ref={photoRef}
        className="relative h-[280px] w-full overflow-hidden sm:h-[380px] md:h-[480px]"
      >
        <motion.div style={{ y: photoY }} className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="relative h-[116%] w-full"
          >
            <Image
              src={data.headerImage}
              alt={data.headerImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          style={{ y: logoY, opacity: logoOpacity }}
          className="absolute inset-x-0 top-24 flex justify-center px-4 sm:top-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          >
            <Image
              src="/images/logo_hero.webp"
              alt="STADS - Students' Association for Data Analytics & Statistics"
              width={658}
              height={205}
              priority
              className="h-auto w-[220px] sm:w-[280px] md:w-[330px]"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="relative inline-block">
          <Logo className="absolute -left-16 bottom-1 hidden h-16 w-16 sm:block" />
          <h1 className="text-balance text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px]">
            <LineReveal
              delay={0.15}
              className="bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-thin italic text-transparent"
            >
              {data.taglineAccent}
            </LineReveal>
            <LineReveal
              delay={0.3}
              className="bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-bold text-transparent"
            >
              {data.taglineBold}
            </LineReveal>
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-balance text-brand-900/70"
        >
          {subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Magnetic>
            <Link
              href={data.primaryCta.href}
              className="block rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
            >
              {data.primaryCta.label}
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href={data.secondaryCta.href}
              className="block rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
            >
              {data.secondaryCta.label}
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

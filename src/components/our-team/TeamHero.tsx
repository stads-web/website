"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import SplitText from "../motion/SplitText";

const TITLE = "One Team, Seven Departments";

const filled =
  "block rounded-full border border-white bg-white px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50";
const outline =
  "block rounded-full border border-white/60 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10";

function Headline() {
  return (
    <div className="text-center">
      <h1 className="mx-auto max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl xl:text-6xl">
        <SplitText text={TITLE} delay={0.1} />
      </h1>
    </div>
  );
}

function Buttons({ className }: { className: string }) {
  return (
    <div className={className}>
      <Magnetic>
        <Link href="#board" className={filled}>
          Meet the board
        </Link>
      </Magnetic>
      <Magnetic>
        <Link href="#departments" className={outline}>
          Join a department
        </Link>
      </Magnetic>
    </div>
  );
}

export default function TeamHero() {
  const reduce = useReducedMotion();

  return (
    <section>
      {/* Desktop: photo as stage, exactly one window high; the board follows on scroll.
          Crop is top-biased (object-position y 5%) so faces (~29-60% of the image) stay in view. */}
      <div className="relative isolate hidden h-[calc(100svh+5rem)] min-h-[calc(720px+5rem)] overflow-hidden bg-brand-950 lg:block">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: reduce ? 1 : 1.05 }}
          transition={{ duration: 12, ease: "linear" }}
        >
          <Image
            src="/images/team/team.webp"
            alt="Das STADS-Team"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[50%_5%] [@media(min-aspect-ratio:19/10)_and_(min-height:880px)]:object-[50%_30%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/25 to-brand-950/80" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 px-6 pt-24">
          <Headline />
        </div>
        <Buttons className="absolute inset-x-0 bottom-[calc(5rem+5rem)] flex justify-center gap-3" />
      </div>

      {/* Mobile: one composed screen - headline and actions on navy, the whole
          team photo (no crop) anchored to the bottom and melting up into it. */}
      <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-950 lg:hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_60%_at_50%_100%,rgba(90,110,151,0.35),transparent_70%)]"
        />
        <div className="px-5 pt-28 text-center sm:px-6 sm:pt-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-300">
            Our Team
          </p>
          <h1 className="mx-auto mt-5 max-w-[11ch] text-balance text-[2.9rem] font-medium leading-[1.02] tracking-tight text-white sm:max-w-3xl sm:text-6xl">
            <SplitText text={TITLE} delay={0.1} />
          </h1>
          <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3">
            <Magnetic>
              <Link href="#board" className={`${filled.replace("px-6", "px-4")} text-center text-[15px]`}>
                Meet the board
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="#departments" className={`${outline.replace("px-6", "px-4")} text-center text-[15px]`}>
                Join a department
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="relative mt-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/team/team.webp"
              alt="Das STADS-Team"
              width={4266}
              height={3197}
              quality={95}
              priority
              sizes="100vw"
              className="block h-auto w-full"
            />
          </motion.div>
          <div className="absolute inset-x-0 top-10 h-24 bg-gradient-to-b from-brand-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}

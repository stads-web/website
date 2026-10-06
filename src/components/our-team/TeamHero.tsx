"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;

/** One headline line, risen out of its own mask. */
function Line({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="-mb-[0.2em] block overflow-hidden pb-[0.2em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Mobile hero. The team photo stays whole (4:3, no crop) as one large card.
 * It opens from a circle - the STADS mark's own shape - when the page loads,
 * and the huge headline sits above it in a three-line stack where "Seven" is
 * set in the site's italic serif. A slow-turning outline of the mark sits
 * behind everything, and the same photo, blurred, lights the background.
 * Scrolling eases the headline up and lets the card settle back.
 */
function MobileHero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 24]);

  return (
    <div
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-950 px-4 pb-20 pt-[5.75rem] sm:px-8 lg:hidden"
    >
      {/* Light source: the team photo itself, blurred. */}
      <Image
        src="/images/team/team.webp"
        alt=""
        aria-hidden
        fill
        priority
        quality={40}
        sizes="100vw"
        className="-z-30 scale-[1.7] object-cover object-[50%_45%] blur-3xl saturate-[1.2]"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-brand-950/90 via-brand-950/70 to-brand-950/85" />

      {/* The mark, enormous and faint, turning once every ~two minutes. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[42%] -top-[6%] -z-10 aspect-square w-[130%] opacity-[0.09]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
      >
        <Image src="/brand/stads-mark-white.svg" alt="" fill sizes="130vw" />
      </motion.div>

      <motion.div style={{ y: headY }} className="relative">
        <motion.p
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-brand-300"
        >
          <span className="h-px w-8 bg-brand-400" />
          Our Team
        </motion.p>

        <h1 className="mt-5 text-[13.4vw] font-medium leading-[0.94] tracking-[-0.035em] text-white sm:text-[11vw]">
          <Line delay={0.25}>One Team,</Line>
          <Line delay={0.35} className="font-accent font-normal italic tracking-[-0.02em] text-brand-300">
            Seven
          </Line>
          <Line delay={0.45}>
            <span className="relative">
              Departments
              <motion.sup
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute -right-6 top-[0.35em] font-mono text-[11px] font-normal tracking-widest text-brand-300"
              >
                07
              </motion.sup>
            </span>
          </Line>
        </h1>
      </motion.div>

      <div className="mt-auto pt-10">
        <motion.div style={{ scale: cardScale, y: cardY }} className="origin-bottom">
          <motion.div
            initial={reduce ? false : { clipPath: "circle(0% at 50% 55%)" }}
            animate={{ clipPath: "circle(75% at 50% 55%)" }}
            transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
            className="relative overflow-hidden rounded-[28px] shadow-[0px_30px_60px_rgba(4,9,20,0.55)] ring-1 ring-white/15"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          className="mt-5 grid grid-cols-2 gap-3"
        >
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
        </motion.div>

        <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>Team STADS</span>
          <span className="flex items-center gap-2">
            Scroll
            <motion.span
              aria-hidden
              className="block h-4 w-px bg-white/50"
              animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            />
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
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

      <MobileHero reduce={!!reduce} />
    </section>
  );
}

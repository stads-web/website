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
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
        Our Team
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl xl:text-6xl">
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
      {/* Desktop: photo as stage. The container has the photo's own aspect ratio,
          so the whole photo is shown and the white fade sits at its very end. */}
      <div className="relative isolate hidden aspect-[4266/3197] overflow-hidden bg-brand-950 lg:block">
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
            className="object-cover object-[50%_5%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/25 to-brand-950/80" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 px-6 pt-28">
          <Headline />
        </div>
        <Buttons className="absolute inset-x-0 bottom-20 flex justify-center gap-3" />
      </div>

      {/* Mobile: dark block with text, then the complete photo (no crop). */}
      <div className="lg:hidden">
        <div className="bg-brand-950 px-4 pb-8 pt-28 sm:px-6">
          <Headline />
          <Buttons className="mt-8 flex flex-wrap justify-center gap-3" />
        </div>
        <div className="relative">
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
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}

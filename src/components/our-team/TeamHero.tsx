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

      {/* Mobile: the team photo is the hero. It sits high and central, uncropped,
          with the headline set on the wall above the heads exactly like on
          desktop. The same photo, blurred and darkened, fills the space around
          it so there is no flat colour block, and the buttons sit right under
          the picture. */}
      <div className="relative isolate overflow-hidden bg-brand-950 pb-16 pt-[5.5rem] sm:pt-24 lg:hidden">
        <Image
          src="/images/team/team.webp"
          alt=""
          aria-hidden
          fill
          priority
          quality={40}
          sizes="100vw"
          className="-z-20 scale-[1.6] object-cover object-[50%_40%] blur-2xl saturate-[1.15]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/80 via-brand-950/50 to-brand-950/40" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-brand-950/85 via-brand-950/40 to-transparent" />
          <h1 className="absolute inset-x-0 top-0 px-5 pt-[3.5vw] text-center text-[8.6vw] font-medium leading-[1.02] tracking-tight text-white [text-shadow:0_2px_24px_rgba(8,15,32,0.45)]">
            <SplitText text={TITLE} delay={0.1} />
          </h1>
        </div>

        <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3 px-5">
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

        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
      </div>
    </section>
  );
}

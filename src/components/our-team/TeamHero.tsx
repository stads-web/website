"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "../motion/Magnetic";
import SplitText from "../motion/SplitText";

const TITLE = "One Team, Seven Departments";
const DEPARTMENTS = ["IT", "Cooperation", "Marketing", "Education", "Finance", "Teambuilding", "Datathon"];

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

      {/* Mobile: the photo is the whole screen. The sharp, uncropped team photo
          sits at the bottom; the same photo, blurred and darkened, fills the
          space above it, so the headline lands on real colour from the picture
          instead of a flat block. A ribbon of department names runs across the
          wall above the heads. */}
      <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-950 lg:hidden">
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/85 via-brand-950/55 to-brand-950/30" />

        <div className="px-5 pt-28 text-center sm:px-6 sm:pt-32">
          <h1 className="mx-auto max-w-[10ch] text-balance text-[3.4rem] font-medium leading-[0.98] tracking-tight text-white sm:max-w-3xl sm:text-7xl">
            <SplitText text={TITLE} delay={0.1} />
          </h1>
          <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3">
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

        <div className="relative mt-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)]"
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

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
          >
            <div className="flex w-max animate-[marquee_50s_linear_infinite]">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center">
                  {DEPARTMENTS.map((name) => (
                    <span key={`${copy}-${name}`} className="flex items-center">
                      <span className="whitespace-nowrap px-4 text-[2.6rem] font-medium leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)]">
                        {name}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import Spotlight from "./motion/Spotlight";
import type { ProgramData, ProgramItem } from "@/lib/types";

const COLUMN_OFFSETS = ["sm:mt-[121px]", "sm:mt-0", "sm:mt-[76px]"];
const TILT = 7;

function ProgramCard({ item }: { item: ProgramItem }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(rotateXRaw, spring);
  const rotateY = useSpring(rotateYRaw, spring);

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (flipped || !window.matchMedia("(hover: hover)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * TILT * 2);
    rotateXRaw.set(-py * TILT * 2);
  };

  const reset = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <div className="[perspective:1400px]">
      <motion.button
        ref={ref}
        type="button"
        onClick={() => setFlipped((v) => !v)}
        onMouseMove={onMove}
        onMouseLeave={reset}
        aria-pressed={flipped}
        aria-label={`${item.title} - tap to flip`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block h-[340px] w-full shrink-0 text-left sm:h-[380px]"
      >
        <div
          className={`relative h-full w-full rounded-[40px] shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-700 [transform-style:preserve-3d] group-hover:shadow-[0px_10px_20px_rgba(15,29,54,0.08),0px_25px_50px_rgba(15,29,54,0.10),0px_45px_90px_rgba(15,29,54,0.14)] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[40px] border border-white/60 bg-brand-50 p-5 [backface-visibility:hidden]">
            <div className="relative h-[60%] w-full overflow-hidden rounded-[20px] border border-white/60">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 640px) 340px, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </div>
            <div className="mt-4">
              <p className="text-lg font-medium text-brand-900">{item.title}</p>
              <span className="mt-2 inline-block text-[13px] text-brand-900/50">
                Tap to learn more
              </span>
            </div>
            <Spotlight />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[40px] border border-white/60 bg-brand-800 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-lg font-medium text-white">{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {item.description}
            </p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

export default function Program({ data }: { data: ProgramData }) {
  const columns = [
    data.items.slice(0, 2),
    data.items.slice(2, 4),
    data.items.slice(4, 6),
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const drift = [
    useTransform(scrollYProgress, [0, 1], [0, -70]),
    useTransform(scrollYProgress, [0, 1], [0, 55]),
    useTransform(scrollYProgress, [0, 1], [0, -35]),
  ];

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
          <SplitText text={data.title} />{" "}
          <SplitText
            text={data.titleAccent}
            delay={0.2}
            className="text-brand-500"
          />
        </h2>

        <div className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-[29px]">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              style={{ y: isDesktop ? drift[i] : 0 }}
              className={`flex flex-1 flex-col gap-5 ${COLUMN_OFFSETS[i]}`}
            >
              {col.map((item, j) => (
                <Reveal key={item.title} delay={j * 0.08}>
                  <ProgramCard item={item} />
                </Reveal>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

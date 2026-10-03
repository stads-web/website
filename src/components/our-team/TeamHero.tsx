"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function TeamHero() {
  const reduce = useReducedMotion();

  return (
    <section>
      <h1 className="sr-only">Our Team</h1>
      {/* Desktop: photo as stage. Crop is intentionally top-biased (object-position y 5%):
          bottom (bodies) is cropped first, faces sit at ~29-60% of the image height. */}
      <div className="relative isolate hidden h-[100svh] min-h-[640px] max-h-[1000px] overflow-hidden bg-brand-950 lg:block">
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
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-950/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Mobile: complete photo (no crop) under a navy band for the fixed header. */}
      <div className="lg:hidden">
        <div className="relative bg-brand-950 pt-20">
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
          <div className="absolute inset-x-0 top-20 h-12 bg-gradient-to-b from-brand-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}

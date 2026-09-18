"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Magnetic from "@/components/motion/Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-accent text-2xl italic text-brand-500"
      >
        this page returned a null value
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="mt-2 bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-heading text-7xl font-bold text-transparent sm:text-8xl md:text-9xl"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
        className="mx-auto mt-6 max-w-md text-balance text-brand-900/70"
      >
        We looked everywhere in the dataset — this page just isn&apos;t in the sample.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.34 }}
        className="mt-8"
      >
        <Magnetic className="inline-block">
          <Link
            href="/"
            className="block rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
          >
            Back to home
          </Link>
        </Magnetic>
      </motion.div>
    </section>
  );
}

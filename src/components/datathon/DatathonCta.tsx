import Link from "next/link";
import Reveal from "../motion/Reveal";
import Magnetic from "../motion/Magnetic";
import SplitText from "../motion/SplitText";
import Constellation from "../motion/Constellation";
import type { DatathonCtaData } from "@/lib/types";

export default function DatathonCta({ data }: { data: DatathonCtaData }) {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-24 text-center sm:py-32">
      <Constellation />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
            {data.eyebrow}
          </p>
        </Reveal>
        <h2 className="mt-4 text-5xl font-medium text-white sm:text-6xl md:text-7xl lg:text-[92px] lg:leading-[1.05]">
          <SplitText text={data.title} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-md text-balance leading-relaxed text-white/60">
            {data.text}
          </p>
          <Magnetic className="mt-10 inline-block">
            <Link
              href={data.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-white px-8 py-4 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
            >
              {data.ctaLabel}
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import Reveal from "./motion/Reveal";
import Magnetic from "./motion/Magnetic";
import SplitText from "./motion/SplitText";
import Constellation from "./motion/Constellation";
import type { FinalCtaData } from "@/lib/types";

export default function FinalCta({ data }: { data: FinalCtaData }) {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-20 text-center sm:py-28">
      <Constellation />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <Reveal>
          <p className="text-2xl text-brand-300">{data.eyebrow}</p>
        </Reveal>
        <h2 className="mt-2 text-4xl font-medium text-white sm:text-5xl md:text-6xl lg:text-[80px]">
          <SplitText text={data.title} />
        </h2>
        <Reveal delay={0.25}>
          <Magnetic className="mt-8 inline-block">
            <Link
              href={data.ctaHref}
              className="block rounded-full bg-white px-7 py-3 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
            >
              {data.ctaLabel}
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

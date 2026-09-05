import Link from "next/link";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import Magnetic from "../motion/Magnetic";
import type { JoinHeroData } from "@/lib/types";

export default function JoinHero({ data }: { data: JoinHeroData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-10">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-500">
          {data.eyebrow}
        </p>
      </Reveal>
      <h1 className="mt-2 text-4xl font-medium text-brand-900 sm:text-5xl md:text-6xl lg:text-[80px] lg:leading-[1.05]">
        <SplitText text={data.title} delay={0.1} />
      </h1>
      <Reveal delay={0.3}>
        <p className="mx-auto mt-6 max-w-xl text-balance leading-relaxed text-brand-900/70">
          {data.intro}
        </p>
        <Magnetic className="mt-8 inline-block">
          <Link
            href={data.ctaHref}
            className="block rounded-full bg-brand-500 px-7 py-3 font-bold text-white transition-colors hover:bg-brand-600"
          >
            {data.ctaLabel}
          </Link>
        </Magnetic>
      </Reveal>
    </section>
  );
}

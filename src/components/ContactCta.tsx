import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./motion/Reveal";
import Magnetic from "./motion/Magnetic";
import type { FinalCtaData } from "@/lib/types";

export default function ContactCta({ data }: { data: FinalCtaData }) {
  return (
    <section className="py-20 text-center sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal>
          <p className="text-2xl text-brand-400/70">{data.eyebrow}</p>
          <h2 className="mt-2 text-4xl font-medium text-brand-900 sm:text-5xl md:text-6xl lg:text-[80px]">
            {data.title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <Magnetic className="mt-8 inline-block">
            <Link
              href={data.ctaHref}
              className="inline-flex items-center gap-3 rounded-lg border border-brand-800 bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              {data.ctaLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

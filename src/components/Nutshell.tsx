import Link from "next/link";
import Reveal from "./motion/Reveal";
import CountUp from "./motion/CountUp";
import Magnetic from "./motion/Magnetic";
import SectionHeading from "./motion/SectionHeading";
import type { NutshellData } from "@/lib/types";

export default function Nutshell({
  data,
  paragraph,
}: {
  data: NutshellData;
  paragraph: string;
}) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start md:gap-16">
        <SectionHeading eyebrow="Who we are" title={data.title} intro={paragraph} />

        <Reveal delay={0.12}>
          <div className="rounded-2xl bg-brand-50 p-6 shadow-card">
            <p className="text-lg font-medium text-brand-900">
              {data.statsHeading}
            </p>
            <dl className="mt-4 space-y-3">
              {data.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="border-t border-brand-200/70 pt-3 first:border-t-0 first:pt-0"
                >
                  <dt className="sr-only">{stat.label || stat.value}</dt>
                  <dd className="text-base font-bold text-brand-900">
                    <CountUp value={stat.value} />
                    {stat.label && (
                      <span className="ml-2 text-sm font-normal text-brand-900/60">
                        {stat.label}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <Magnetic className="mt-6 inline-block">
              <Link
                href={data.ctaHref}
                className="inline-block rounded-full bg-brand-100 px-5 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-200"
              >
                {data.ctaLabel}
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

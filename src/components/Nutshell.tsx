import Link from "next/link";
import Reveal from "./motion/Reveal";
import CountUp from "./motion/CountUp";
import Magnetic from "./motion/Magnetic";
import SectionHeading from "./motion/SectionHeading";
import Constellation from "./motion/Constellation";
import type { NutshellData, Stat } from "@/lib/types";

const hasNumber = (stat: Stat) => /\d/.test(stat.value);

export default function Nutshell({
  data,
  paragraph,
}: {
  data: NutshellData;
  paragraph: string;
}) {
  const figures = data.stats.filter(hasNumber);
  const statements = data.stats.filter((stat) => !hasNumber(stat));

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start md:gap-16">
        <SectionHeading eyebrow="Who we are" title={data.title} intro={paragraph} />

        <Reveal delay={0.12}>
          <div className="relative overflow-hidden rounded-[32px] bg-brand-950 p-8 shadow-[0px_15px_30px_rgba(15,29,54,0.12),0px_40px_80px_rgba(15,29,54,0.18)]">
            <Constellation />

            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-brand-300">
                {data.statsHeading}
              </p>

              <dl className="mt-8 space-y-7">
                {figures.map((stat) => (
                  <div key={stat.value}>
                    <dt className="sr-only">{stat.label || stat.value}</dt>
                    <dd>
                      <span className="block text-5xl font-medium tracking-tight text-white">
                        <CountUp value={stat.value} />
                      </span>
                      {stat.label && (
                        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                          {stat.label}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {statements.map((stat) => (
                <p
                  key={stat.value}
                  className="mt-8 border-t border-white/10 pt-6 text-lg leading-relaxed text-white/80"
                >
                  {stat.value}
                  {stat.label && (
                    <span className="text-white/40"> {stat.label}</span>
                  )}
                </p>
              ))}

              <Magnetic className="mt-8 inline-block">
                <Link
                  href={data.ctaHref}
                  className="block rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
                >
                  {data.ctaLabel}
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

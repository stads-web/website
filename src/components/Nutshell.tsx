import Link from "next/link";
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
        <div>
          <h2 className="text-3xl font-semibold text-brand-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-5 max-w-2xl text-balance leading-relaxed text-brand-900/75">
            {paragraph}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            {data.statsHeading}
          </p>
          <dl className="mt-4 space-y-4">
            {data.stats.map((stat) => (
              <div key={stat.value} className="border-t border-brand-200/70 pt-3 first:border-t-0 first:pt-0">
                <dt className="sr-only">{stat.label || stat.value}</dt>
                <dd className="text-lg font-bold text-brand-900">
                  {stat.value}
                  {stat.label && (
                    <span className="ml-2 text-sm font-normal text-brand-900/60">
                      {stat.label}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href={data.ctaHref}
            className="mt-6 inline-block rounded-full bg-brand-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-900"
          >
            {data.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

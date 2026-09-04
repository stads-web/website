import Link from "next/link";
import type { FinalCtaData } from "@/lib/types";

export default function FinalCta({ data }: { data: FinalCtaData }) {
  return (
    <section className="bg-brand-950 py-20 text-center sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <p className="text-2xl text-brand-300">{data.eyebrow}</p>
        <h2 className="mt-2 text-4xl font-medium text-white sm:text-5xl md:text-6xl lg:text-[80px]">
          {data.title}
        </h2>
        <Link
          href={data.ctaHref}
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
        >
          {data.ctaLabel}
        </Link>
      </div>
    </section>
  );
}

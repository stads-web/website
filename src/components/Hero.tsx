import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import type { HeroData } from "@/lib/types";

export default function Hero({
  data,
  subtext,
}: {
  data: HeroData;
  subtext: string;
}) {
  return (
    <section>
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[320px] md:h-[440px]">
        <Image
          src={data.headerImage}
          alt={data.headerImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/75 via-brand-950/25 to-transparent" />
      </div>

      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
        <Logo className="mx-auto mb-6 h-14 w-14" />
        <h1 className="text-balance text-4xl leading-tight sm:text-5xl md:text-6xl">
          <span className="block font-accent italic font-normal text-brand-500">
            {data.taglineAccent}
          </span>
          <span className="block font-bold text-brand-900">
            {data.taglineBold}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-brand-900/70">
          {subtext}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={data.primaryCta.href}
            className="rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
          >
            {data.primaryCta.label}
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-brand-50"
          >
            {data.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

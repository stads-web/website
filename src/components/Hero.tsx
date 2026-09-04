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
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[380px] md:h-[480px]">
        <Image
          src={data.headerImage}
          alt={data.headerImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute inset-x-0 top-24 flex justify-center px-4 sm:top-28">
          <Image
            src="/images/logo_hero.webp"
            alt="STADS - Students' Association for Data Analytics & Statistics"
            width={658}
            height={205}
            priority
            className="h-auto w-[220px] sm:w-[280px] md:w-[330px]"
          />
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="relative inline-block">
          <Logo className="absolute -left-16 bottom-1 hidden h-16 w-16 sm:block" />
          <h1 className="text-balance text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px]">
            <span className="block bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-thin italic text-transparent">
              {data.taglineAccent}
            </span>
            <span className="block bg-gradient-to-b from-brand-500 to-brand-800 bg-clip-text font-bold text-transparent">
              {data.taglineBold}
            </span>
          </h1>
        </div>
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

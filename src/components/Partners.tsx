import Image from "next/image";
import Reveal from "./motion/Reveal";
import type { Partner, PartnersData } from "@/lib/types";

function LogoBox({ partner, className = "" }: { partner: Partner; className?: string }) {
  const boxStyles =
    partner.box === "blue"
      ? "bg-brand-500 border-white/50"
      : "bg-white border-brand-200";
  return (
    <div
      className={`flex items-center justify-center rounded-[10px] border-[0.5px] px-8 py-6 transition-transform duration-300 hover:-translate-y-1 ${boxStyles} ${className}`}
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={160}
        height={48}
        className="h-auto max-h-8 w-auto max-w-full object-contain"
      />
    </div>
  );
}

export default function Partners({ data }: { data: PartnersData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-2xl font-medium text-brand-400 sm:text-3xl md:text-[50px]">
              {data.title}
            </p>
            <h2 className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px]">
              {data.subtitle}
            </h2>
          </div>
          <p className="text-sm text-brand-900/70">{data.trustLine}</p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-[1.2fr_2fr]">
        <Reveal>
          <LogoBox
            partner={data.featuredPartner}
            className="h-full min-h-[140px]"
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.partners.map((partner, i) => (
            <Reveal key={partner.name} delay={0.06 * i}>
              <LogoBox partner={partner} className="min-h-[64px]" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import PartnerLogo, { partnerLinkProps, partnerLinkClass } from "./PartnerLogo";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import type { Partner, PartnersData } from "@/lib/types";

function LogoBox({ partner, className = "" }: { partner: Partner; className?: string }) {
  const Tag = partner.href ? "a" : "div";
  return (
    <Tag
      {...partnerLinkProps(partner)}
      className={`flex items-center justify-center rounded-[14px] border border-white/10 bg-brand-800 px-6 py-6 transition-transform duration-300 hover:-translate-y-1 ${partner.href ? partnerLinkClass : ""} ${className}`}
    >
      <PartnerLogo partner={partner} />
    </Tag>
  );
}

export default function Partners({ data }: { data: PartnersData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-2xl font-medium text-brand-400 sm:text-3xl md:text-[50px] md:leading-[1.1]">
            <SplitText text={data.title} />
          </p>
          <h2 className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px] md:leading-[1.1]">
            <SplitText text={data.subtitle} delay={0.15} />
          </h2>
        </div>
        <Reveal delay={0.3}>
          <p className="text-sm text-brand-900/70">{data.trustLine}</p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-[1.2fr_2fr]">
        <Reveal className="h-full">
          <LogoBox
            partner={data.featuredPartner}
            className="h-full min-h-[140px] [--logo-u:3.4rem]"
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.partners.map((partner, i) => (
            <Reveal key={partner.name} delay={0.06 * i} className="h-full">
              <LogoBox partner={partner} className="h-full min-h-[96px] [--logo-u:1.9rem]" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

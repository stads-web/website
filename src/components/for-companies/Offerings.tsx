import Image from "next/image";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import type { OfferingsData } from "@/lib/types";

export default function Offerings({ data }: { data: OfferingsData }) {
  return (
    <section id="offerings" className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <SectionHeading eyebrow="What we can do together" title={data.title} />

      <div className="mt-12 flex flex-col sm:gap-4">
        {data.items.map((item, i) => (
          <Reveal
            key={item.heading}
            className={`grid gap-8 border-t border-brand-100 py-16 first:border-t-0 first:pt-0 sm:gap-16 sm:py-20 sm:first:pt-0 md:grid-cols-2 md:items-center ${
              item.imageSide === "left" ? "" : "md:[&>*:first-child]:order-2"
            }`}
          >
            <div className="group relative aspect-[478/315] w-full overflow-hidden rounded-[40px] border border-white/60 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 768px) 480px, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-mono text-xs text-brand-300">
                {String(i + 1).padStart(2, "0")} / {String(data.items.length).padStart(2, "0")}
              </span>
              <p className="mt-3 text-2xl font-medium tracking-tight text-brand-900 sm:text-3xl">
                {item.heading}
              </p>
              <p className="mt-3 leading-relaxed text-brand-900/70">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

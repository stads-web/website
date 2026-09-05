import Image from "next/image";
import Reveal from "../motion/Reveal";
import type { OfferingsData } from "@/lib/types";

export default function Offerings({ data }: { data: OfferingsData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
      <Reveal>
        <h2 className="text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
          {data.title}
        </h2>
      </Reveal>

      <div className="mt-12 flex flex-col gap-16 sm:gap-20">
        {data.items.map((item) => (
          <Reveal
            key={item.heading}
            className={`grid gap-8 md:grid-cols-2 md:items-center md:gap-16 ${
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
              <p className="text-xl font-medium text-brand-900">{item.heading}</p>
              <p className="mt-3 leading-relaxed text-brand-900/70">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

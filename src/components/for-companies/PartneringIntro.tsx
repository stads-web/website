import Image from "next/image";
import { marked } from "marked";
import Reveal from "../motion/Reveal";
import type { CompanyIntroData } from "@/lib/types";

export default function PartneringIntro({
  data,
  body,
}: {
  data: CompanyIntroData;
  body: string;
}) {
  const html = marked.parse(body, { async: false }) as string;

  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
      <Reveal>
        <h2 className="mx-auto max-w-3xl text-balance bg-gradient-to-r from-brand-900 to-brand-500 bg-clip-text text-center text-3xl font-medium text-transparent sm:text-4xl md:text-[50px]">
          {data.title}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start md:gap-16">
        <Reveal delay={0.1}>
          <div
            className="max-w-2xl text-lg leading-relaxed text-brand-500 [&_strong]:font-bold [&_strong]:text-brand-500"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative aspect-square w-full overflow-hidden rounded-[40px] border border-white/60 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 768px) 500px, 90vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

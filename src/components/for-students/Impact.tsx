import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import type { IntroData } from "@/lib/types";

export default function Impact({ data, body }: { data: IntroData; body: string }) {
  const html = marked.parse(body, { async: false }) as string;

  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="mx-auto max-w-3xl text-balance bg-gradient-to-r from-brand-900 to-brand-500 bg-clip-text text-center text-3xl font-medium text-transparent sm:text-4xl md:text-[50px]">
        {data.title}
      </h2>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16">
        <div>
          <div
            className="max-w-2xl text-lg leading-relaxed text-brand-500 [&_strong]:font-bold [&_strong]:text-brand-500"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-10">
            <p className="text-lg font-medium text-brand-900">{data.whatsappLabel}</p>
            <Link
              href={data.whatsappHref}
              className="mt-3 inline-block rounded-full bg-brand-500 px-6 py-3 font-bold text-white transition-colors hover:bg-brand-600"
            >
              {data.whatsappCta}
            </Link>
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-[40px] border border-white/60 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            sizes="(min-width: 768px) 500px, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ProgramData } from "@/lib/types";

export default function Program({ data }: { data: ProgramData }) {
  return (
    <section className="bg-brand-50 py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold text-brand-900 sm:text-4xl">
          {data.title}{" "}
          <span className="text-brand-500">{data.titleAccent}</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
          {data.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative block overflow-hidden rounded-2xl shadow-card transition-transform duration-300 hover:-translate-y-1 ${
                item.size === "large"
                  ? "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-[4/5]"
                  : "aspect-[4/5]"
              }`}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-semibold text-white">{item.title}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm text-white/80 transition-colors group-hover:text-white">
                  {data.ctaLabel}
                  <CaretRight size={14} weight="bold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

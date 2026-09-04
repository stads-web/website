import type { PartnersData } from "@/lib/types";

const BOX_STYLES = [
  "bg-brand-800 text-white",
  "bg-white text-brand-900 border border-brand-200",
  "bg-brand-500 text-white",
];

export default function Partners({ data }: { data: PartnersData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xl text-brand-500 sm:text-2xl">{data.title}</p>
          <h2 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
            {data.subtitle}
          </h2>
        </div>
        <p className="text-sm text-brand-900/50">{data.trustLine}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-[1.2fr_2fr]">
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl bg-brand-800 p-6 text-2xl font-semibold text-white">
          {data.featuredPartner}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.partners.map((partner, i) => (
            <div
              key={`${partner}-${i}`}
              className={`flex min-h-[64px] items-center justify-center rounded-xl px-3 py-4 text-center text-sm font-medium ${BOX_STYLES[i % BOX_STYLES.length]}`}
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { WhyJoinData } from "@/lib/types";

const EMOJI = ["💡", "📚", "👥", "🤝"];

export default function WhyJoin({ data }: { data: WhyJoinData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="max-w-3xl text-balance text-3xl font-medium sm:text-4xl md:text-[50px]">
        <span className="text-brand-900">{data.title} </span>
        <span className="text-brand-400/50">{data.subtitle}</span>
      </h2>

      <div className="mt-12 flex max-w-2xl flex-col gap-8">
        {data.items.map((item, i) => (
          <div key={item.heading}>
            <p className="text-lg font-medium text-brand-900">{item.heading}</p>
            <p className="mt-2 text-base text-brand-900/70">
              {EMOJI[i]} {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

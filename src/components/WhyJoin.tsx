import { iconMap } from "@/lib/icons";
import type { WhyJoinData } from "@/lib/types";

export default function WhyJoin({ data }: { data: WhyJoinData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xl text-brand-500 sm:text-2xl">{data.title}</p>
        <h2 className="text-2xl font-semibold text-brand-900 sm:text-3xl">
          {data.subtitle}
        </h2>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {data.items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.heading} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                {Icon && <Icon size={22} weight="bold" aria-hidden="true" />}
              </div>
              <div>
                <p className="font-semibold text-brand-900">{item.heading}</p>
                <p className="mt-1 text-brand-900/70">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

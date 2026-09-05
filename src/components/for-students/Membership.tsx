import type { MembershipData } from "@/lib/types";

export default function Membership({ data }: { data: MembershipData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-balance bg-gradient-to-r from-brand-900 to-brand-800/80 bg-clip-text text-3xl font-medium text-transparent sm:text-4xl md:text-[50px]">
        {data.title}
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {data.tiers.map((tier) => (
          <div key={tier.name}>
            <div className="flex items-center justify-center rounded-full bg-brand-500 px-6 py-3">
              <p className="text-lg font-medium text-white">{tier.name}</p>
            </div>
            <ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-brand-900">
              {tier.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import type { WhyJoinData } from "@/lib/types";

const EMOJI = ["💡", "📚", "👥", "🤝"];

export default function WhyJoin({ data }: { data: WhyJoinData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="max-w-3xl text-balance text-3xl font-medium sm:text-4xl md:text-[50px]">
        <SplitText text={data.title} className="text-brand-900" />{" "}
        <SplitText
          text={data.subtitle}
          delay={0.2}
          className="text-brand-400/50"
        />
      </h2>

      <div className="mt-12 flex max-w-2xl flex-col gap-8">
        {data.items.map((item, i) => (
          <Reveal key={item.heading} delay={0.08 * i}>
            <p className="text-lg font-medium text-brand-900">{item.heading}</p>
            <p className="mt-2 text-base text-brand-900/70">
              {EMOJI[i]} {item.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

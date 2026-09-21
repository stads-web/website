import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import type { HowItWorksData } from "@/lib/types";

export default function HowItWorks({ data }: { data: HowItWorksData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} />

      <div className="mt-14 border-t border-brand-100">
        {data.steps.map((step, i) => (
          <Reveal key={step.title} delay={0.06 * i}>
            <div className="group grid gap-3 border-b border-brand-100 py-10 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-10 sm:py-12">
              <span
                aria-hidden
                className="pointer-events-none select-none text-[4.5rem] font-medium leading-none text-brand-100 transition-colors duration-500 group-hover:text-brand-200 sm:text-[5.5rem]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-xl font-medium text-brand-900 sm:text-2xl">{step.title}</p>
                <p className="mt-2 max-w-xl leading-relaxed text-brand-900/65">{step.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

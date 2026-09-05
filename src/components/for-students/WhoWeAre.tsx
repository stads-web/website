import Reveal from "../motion/Reveal";
import type { WhoWeAreData } from "@/lib/types";

export default function WhoWeAre({
  data,
  intro,
}: {
  data: WhoWeAreData;
  intro: string;
}) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6">
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-balance bg-gradient-to-r from-brand-900 to-brand-800/80 bg-clip-text text-center text-3xl font-medium text-transparent sm:text-4xl md:text-[50px]">
          {data.title}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-brand-900/70">
          {intro}
        </p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-2xl gap-8">
        {data.sections.map((section, i) => (
          <Reveal key={section.heading} delay={0.08 * i}>
            <p className="text-lg font-medium text-brand-900">{section.heading}</p>
            <p className="mt-2 leading-relaxed text-brand-900/70">{section.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

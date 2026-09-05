import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import type { EventsData } from "@/lib/types";

export default function EventsIntro({ data }: { data: EventsData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-10">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-500">
          {data.eyebrow}
        </p>
      </Reveal>
      <h1 className="mt-2 text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px]">
        <SplitText text={data.title} delay={0.1} />
      </h1>
      <Reveal delay={0.3}>
        <p className="mx-auto mt-6 max-w-xl text-balance leading-relaxed text-brand-900/70">
          {data.intro}
        </p>
      </Reveal>
    </section>
  );
}

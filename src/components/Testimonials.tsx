import { Quotes } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./motion/Reveal";
import SplitText from "./motion/SplitText";
import Spotlight from "./motion/Spotlight";
import type { TestimonialsData } from "@/lib/types";

export default function Testimonials({ data }: { data: TestimonialsData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px]">
        <SplitText text={data.title} />
      </p>
      <h2 className="mx-auto max-w-2xl text-balance text-2xl font-medium text-brand-900 sm:text-3xl md:text-[50px]">
        <SplitText text={data.subtitle} delay={0.15} />
      </h2>

      <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
        {data.items.map((item, i) => (
          <Reveal
            key={item.name}
            delay={0.08 * i}
            className={i % 2 === 1 ? "sm:mt-8" : ""}
          >
            <figure className="group relative h-full overflow-hidden rounded-[40px] border border-brand-100 bg-white p-8 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1.5">
              <Spotlight />
              <Quotes
                size={28}
                weight="fill"
                className="text-brand-200"
                aria-hidden="true"
              />
              <blockquote className="mt-3 text-balance leading-relaxed text-brand-900/80">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-brand-900">{item.name}</span>
                <span className="text-brand-900/60"> — {item.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

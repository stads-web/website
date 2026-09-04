import { Quotes } from "@phosphor-icons/react/dist/ssr";
import type { TestimonialsData } from "@/lib/types";

export default function Testimonials({ data }: { data: TestimonialsData }) {
  return (
    <section className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-xl text-brand-500 sm:text-2xl">{data.title}</p>
      <h2 className="mx-auto max-w-2xl text-balance text-2xl font-semibold text-brand-900 sm:text-3xl">
        {data.subtitle}
      </h2>

      <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
        {data.items.map((item, i) => (
          <figure
            key={item.name}
            className={`rounded-2xl border border-brand-100 bg-white p-6 shadow-card ${
              i % 2 === 1 ? "sm:mt-8" : ""
            }`}
          >
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
        ))}
      </div>
    </section>
  );
}

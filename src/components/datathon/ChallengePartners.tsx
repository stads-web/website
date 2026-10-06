import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import type { ChallengePartnersData } from "@/lib/types";

export default function ChallengePartners({
  data,
}: {
  data: ChallengePartnersData;
}) {
  return (
    <section className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-500">
        {data.eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.title} />
      </h2>

      <ul className="mt-14 border-t border-brand-100">
        {data.partners.map(({ name, href }, i) => (
          <Reveal key={name} delay={0.04 * i}>
            <li className="group flex items-baseline justify-between gap-6 border-b border-brand-100 py-6 transition-colors hover:bg-brand-50/60">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} (opens in a new tab)`}
                  className="text-2xl font-medium text-brand-900/45 transition-all duration-500 group-hover:translate-x-2 group-hover:text-brand-900 focus-visible:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:text-4xl"
                >
                  {name}
                </a>
              ) : (
                <span className="text-2xl font-medium text-brand-900/45 transition-all duration-500 group-hover:translate-x-2 group-hover:text-brand-900 sm:text-4xl">
                  {name}
                </span>
              )}
              <span className="font-mono text-xs text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import LogoMarquee from "../motion/LogoMarquee";
import type { Partner, TrustWallData } from "@/lib/types";

export default function TrustWall({
  data,
  logos,
}: {
  data: TrustWallData;
  logos: Partner[];
}) {
  return (
    <section className="overflow-hidden bg-brand-950 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} tone="light" />
      </div>

      <div className="mt-14">
        <LogoMarquee logos={logos} />
      </div>

      {data.names.length > 0 && (
        <div className="mx-auto mt-16 max-w-content px-4 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
            Also on stage with us
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
            {data.names.map((name, i) => (
              <Reveal key={name} delay={0.04 * i}>
                <li className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white">
                  {name}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import Reveal from "../motion/Reveal";
import CountUp from "../motion/CountUp";
import SectionHeading from "../motion/SectionHeading";

// Numbers: 250+ / 30+ / Est. 2017 from content/home/nutshell.md, 7 = items in content/our-team/departments.md.
const stats = [
  { value: "250+", label: "Members" },
  { value: "30+", label: "Events per Semester" },
  { value: "7", label: "Departments" },
  { value: "Est. 2017", label: "" },
];

export default function TeamHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/60">
      {/* The fixed nav uses white text; this navy fade keeps it readable on the light hero. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-900/90 to-transparent" />
      <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 pb-12 pt-28 sm:px-6 lg:min-h-[calc(100svh-2rem)] lg:grid-cols-2 lg:pb-8 lg:pt-32">
        <div>
          <SectionHeading
            eyebrow="Our Team"
            title="One Team, Seven Departments"
            intro="Every part of STADS is run by students – meet the board and the seven teams behind our events."
          />
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.value}>
                <dt className="sr-only">{stat.label || stat.value}</dt>
                <dd>
                  <span className="block text-4xl font-medium tracking-tight text-brand-900">
                    <CountUp value={stat.value} />
                  </span>
                  {stat.label && (
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.22em] text-brand-900/45">
                      {stat.label}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal y={16} className="flex justify-center lg:justify-end">
          <div className="overflow-hidden rounded-3xl border border-brand-100 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
            <Image
              src="/images/team/team.webp"
              alt="Das STADS-Team"
              width={4266}
              height={3197}
              quality={95}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block h-auto w-full max-w-full lg:max-h-[calc(100svh-10rem)] lg:w-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

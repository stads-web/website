import { marked } from "marked";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";
import CountUp from "../motion/CountUp";
import VideoEmbed from "./VideoEmbed";
import type { DatathonAboutData } from "@/lib/types";

export default function DatathonAbout({
  data,
  body,
}: {
  data: DatathonAboutData;
  body: string;
}) {
  const html = marked.parse(body, { async: false }) as string;

  return (
    <section id="about" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <h2 className="max-w-3xl text-3xl font-medium text-brand-900 sm:text-4xl md:text-[50px] md:leading-[1.1]">
        <SplitText text={data.title} />
      </h2>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        <Reveal delay={0.1}>
          <div
            className="text-lg leading-relaxed text-brand-900/70 [&_p+p]:mt-5 [&_strong]:font-bold [&_strong]:text-brand-900"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Reveal>

        <Reveal delay={0.2}>
          <VideoEmbed
            embed={data.videoEmbed}
            link={data.videoLink}
            poster={data.videoPoster}
            posterAlt={data.videoPosterAlt}
            title={data.videoTitle}
          />
          <p className="mt-4 text-sm leading-relaxed text-brand-900/60">
            {data.videoCredit}
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-brand-100 pt-14 sm:grid-cols-4">
        {data.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={0.08 * i}>
            <p className="text-4xl font-medium tracking-tight text-brand-900 sm:text-5xl md:text-6xl">
              <CountUp value={stat.value} />
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-brand-500">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

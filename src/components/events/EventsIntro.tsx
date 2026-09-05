import SectionHeading from "../motion/SectionHeading";
import type { EventsData } from "@/lib/types";

export default function EventsIntro({ data }: { data: EventsData }) {
  return (
    <section className="mx-auto max-w-content px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-10">
      <SectionHeading
        eyebrow={data.eyebrow}
        title={data.title}
        intro={data.intro}
        align="center"
      />
    </section>
  );
}

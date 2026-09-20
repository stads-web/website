import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import EventsIntro from "@/components/events/EventsIntro";
import Timeline from "@/components/events/Timeline";
import FinalCta from "@/components/FinalCta";
import type { EventsData } from "@/lib/types";

const title = "Upcoming Events – STADS";
const description =
  "See what's on the STADS calendar: weekly Monday Sessions, workshops, guest lectures, the Datathon, the Data Bootcamp, and the Python course.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function EventsPage() {
  const { data } = readContent<EventsData>("events/events.md");

  return (
    <main>
      <PageTopFade />
      <EventsIntro data={data} />
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Timeline items={data.formats} />
      </div>
      <FinalCta
        data={{
          eyebrow: "Don't miss the next one",
          title: "Follow along.",
          ctaLabel: data.ctaLabel,
          ctaHref: data.ctaHref,
        }}
      />
    </main>
  );
}

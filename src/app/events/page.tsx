import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import EventsIntro from "@/components/events/EventsIntro";
import Timeline from "@/components/events/Timeline";
import FinalCta from "@/components/FinalCta";
import type { EventsData } from "@/lib/types";

const title = "Data Science Events & Workshops in Mannheim – STADS";
const description =
  "Data Science workshops, guest lectures, the Datathon and weekly Monday Sessions in Mannheim. See what STADS has planned this semester and follow along.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/events" },
  openGraph: {
    ...ogBase,
    title,
    description,
    url: "/events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { ...twitterBase, title, description },
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

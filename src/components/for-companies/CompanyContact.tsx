import Link from "next/link";
import {
  ArrowUpRight,
  CalendarBlank,
  ChalkboardTeacher,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import Magnetic from "../motion/Magnetic";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "../our-team/PortraitFrame";
import type { CompanyContactData } from "@/lib/types";

const TRACK_ICONS = [UsersThree, Trophy, ChalkboardTeacher];

function mailtoFor(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export default function CompanyContact({ data }: { data: CompanyContactData }) {
  const { contact } = data;
  const hasTally = data.tallyFormUrl.trim().length > 0;
  const hasBooking = data.calBookingUrl.trim().length > 0;

  return (
    <section id="contact" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className="flex flex-col gap-4">
          {data.tracks.map((track, i) => {
            const Icon = TRACK_ICONS[i % TRACK_ICONS.length];
            return (
              <Reveal key={track.label} delay={0.05 * i}>
                <a
                  href={mailtoFor(contact.email, track.mailSubject)}
                  className="group block rounded-3xl border border-brand-100 bg-brand-50/60 p-6 transition-colors hover:border-brand-300 hover:bg-white hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon size={26} weight="light" className="text-brand-500" />
                    <ArrowUpRight
                      size={18}
                      className="text-brand-300 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-4 text-lg font-medium text-brand-900">{track.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900/65">{track.text}</p>
                </a>
              </Reveal>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.1} className="rounded-3xl border border-brand-100 bg-white p-2 shadow-card">
            {hasTally ? (
              <iframe
                src={data.tallyFormUrl}
                title="Partnership inquiry form"
                className="h-[480px] w-full rounded-[20px]"
              />
            ) : (
              <div className="flex h-full min-h-[220px] flex-col justify-center rounded-[20px] bg-brand-50 p-8 text-center">
                <p className="text-sm font-medium text-brand-900">
                  Prefer to write it out?
                </p>
                <p className="mt-2 text-sm text-brand-900/65">
                  Our online inquiry form is being set up - for now, pick a track on the
                  left and we&apos;ll get your email directly.
                </p>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <Magnetic>
              <Link
                href={hasBooking ? data.calBookingUrl : mailtoFor(contact.email, "Let's find a time to talk")}
                target={hasBooking ? "_blank" : undefined}
                rel={hasBooking ? "noreferrer" : undefined}
                className="flex items-center justify-center gap-3 rounded-full border border-brand-800 bg-brand-500 px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                <CalendarBlank size={18} weight="bold" />
                {hasBooking ? "Book a 15-minute call" : "Ask us for a call"}
              </Link>
            </Magnetic>
            {!hasBooking && (
              <p className="mt-2 text-center text-xs text-brand-900/45">
                Direct booking link coming soon - this sends us an email for now.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.2} className="flex items-center gap-5 rounded-3xl border border-brand-100 p-5">
            <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-2xl border border-brand-100 sm:w-24">
              <PortraitFrame photo={contact.photo} name={contact.name} initials={contact.initials} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-brand-900">{contact.name}</p>
              <p className="text-sm text-brand-900/60">{contact.role}</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 inline-block truncate text-sm text-brand-500 hover:text-brand-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

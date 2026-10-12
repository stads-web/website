import { ChalkboardTeacher, Trophy, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "../our-team/PortraitFrame";
import ContactForm from "./ContactForm";
import type { CompanyContactData } from "@/lib/types";

const TRACK_ICONS = [UsersThree, Trophy, ChalkboardTeacher];

/**
 * Left: who you will talk to and what we offer. Right: the form. Built from
 * the same cards, radii and button style as the rest of the site. On small
 * screens the form comes first.
 */
export default function CompanyContact({ data }: { data: CompanyContactData }) {
  const { contact } = data;

  return (
    <section id="contact" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-10">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <Reveal>
            <div className="flex items-center gap-5 rounded-3xl border border-brand-100 bg-brand-50/60 p-5">
              {/* Zoomed in on the face so the full-length portrait reads as a headshot. */}
              <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-100 sm:w-28">
                <div className="absolute inset-0 origin-[50%_27%] scale-[2.1]">
                  <PortraitFrame
                    photo={contact.photo}
                    name={contact.name}
                    initials={contact.initials}
                    sizes="240px"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-brand-900/60">Your contact</p>
                <p className="mt-0.5 text-lg font-medium text-brand-900">{contact.name}</p>
                <p className="text-sm text-brand-900/60">{contact.role}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 inline-block break-all text-sm text-brand-500 hover:text-brand-600 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </Reveal>

          {data.tracks.map((t, i) => {
            const Icon = TRACK_ICONS[i % TRACK_ICONS.length];
            return (
              <Reveal key={t.label} delay={0.05 * (i + 1)}>
                <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6">
                  <Icon size={26} weight="light" className="text-brand-500" aria-hidden />
                  <p className="mt-4 text-lg font-medium text-brand-900">{t.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900/65">{t.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <ContactForm tracks={data.tracks} email={contact.email} />
        </Reveal>
      </div>
    </section>
  );
}

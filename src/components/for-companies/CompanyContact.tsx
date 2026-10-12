import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "../our-team/PortraitFrame";
import ContactForm from "./ContactForm";
import type { CompanyContactData } from "@/lib/types";

/**
 * Contact section as one conversation: Gabriel's photo on the left, a form
 * that reads as a sentence addressed to him on the right. No cards, no
 * widgets - just type, rules and a real face.
 */
export default function CompanyContact({ data }: { data: CompanyContactData }) {
  const { contact } = data;
  const firstName = contact.name.split(" ")[0];

  return (
    <section id="contact" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-0">
        {/* Small screens: a compact introduction above the form. */}
        <div className="flex items-center gap-4 lg:hidden">
          <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 origin-[50%_27%] scale-[2.3]">
              <PortraitFrame photo={contact.photo} name={contact.name} initials={contact.initials} sizes="128px" />
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-brand-900">{contact.name}</p>
            <p className="text-sm text-brand-900/60">{contact.role}</p>
          </div>
        </div>

        <Reveal className="hidden lg:col-span-4 lg:block">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
              <div className="absolute inset-0 origin-[50%_26%] scale-[1.55]">
                <PortraitFrame
                  photo={contact.photo}
                  name={contact.name}
                  initials={contact.initials}
                  sizes="(min-width: 1280px) 720px, 560px"
                />
              </div>
            </div>
            <p className="mt-5 text-xl font-medium tracking-tight text-brand-900">{contact.name}</p>
            <p className="mt-1 text-brand-900/60">{contact.role}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 inline-block text-brand-600 underline underline-offset-4 hover:text-brand-950"
            >
              {contact.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <ContactForm tracks={data.tracks} firstName={firstName} email={contact.email} />
        </Reveal>
      </div>
    </section>
  );
}

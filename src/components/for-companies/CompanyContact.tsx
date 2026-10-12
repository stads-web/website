"use client";

import { useState } from "react";
import {
  Check,
  ChalkboardTeacher,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";
import PortraitFrame from "../our-team/PortraitFrame";
import ContactForm from "./ContactForm";
import type { CompanyContactData } from "@/lib/types";

const TRACK_ICONS = [UsersThree, Trophy, ChalkboardTeacher];

export default function CompanyContact({ data }: { data: CompanyContactData }) {
  const { contact } = data;
  const [track, setTrack] = useState<string | null>(null);

  return (
    <section id="contact" className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-10">
        {/* On wide screens the three tracks double as the topic picker; on
            small screens the chips inside the form do the same job. */}
        <div className="hidden flex-col gap-4 lg:flex">
          {data.tracks.map((t, i) => {
            const Icon = TRACK_ICONS[i % TRACK_ICONS.length];
            const active = track === t.label;
            return (
              <Reveal key={t.label} delay={0.05 * i}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTrack(active ? null : t.label)}
                  className={`group block w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
                    active
                      ? "border-brand-800 bg-white shadow-card"
                      : "border-brand-100 bg-brand-50/60 hover:border-brand-300 hover:bg-white hover:shadow-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon size={26} weight="light" className="text-brand-500" />
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                        active
                          ? "border-brand-900 bg-brand-900 text-white"
                          : "border-brand-200 text-transparent group-hover:border-brand-400"
                      }`}
                    >
                      <Check size={12} weight="bold" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-medium text-brand-900">{t.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-900/65">{t.text}</p>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <ContactForm tracks={data.tracks} track={track} onTrack={setTrack} email={contact.email} />
          </Reveal>

          <Reveal delay={0.2} className="flex items-center gap-5 rounded-3xl border border-brand-100 p-5">
            {/* Zoomed in on the face so the full-length portrait reads as a headshot. */}
            <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-100 sm:w-28">
              <div className="absolute inset-0 origin-[50%_27%] scale-[2.1]">
                <PortraitFrame photo={contact.photo} name={contact.name} initials={contact.initials} />
              </div>
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

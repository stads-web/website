"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import PortraitFrame from "../our-team/PortraitFrame";
import type { ContactPerson } from "@/lib/types";

/**
 * The human behind the form: a dark card with a headshot, a line in their own
 * voice and two direct ways in. Sits under the tracks on wide screens and
 * under the form on small ones.
 */
export default function ContactPersonCard({ contact }: { contact: ContactPerson }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the mailto button right next to it still works.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-brand-950 p-6 text-white sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(115,136,176,0.35),transparent_68%)]"
      />

      <div className="relative flex items-center gap-5 sm:gap-6">
        {/* Zoomed in on the face so the full-length portrait reads as a headshot. */}
        <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-[22px] ring-1 ring-white/15 sm:w-32">
          <div className="absolute inset-0 origin-[50%_27%] scale-[2.1]">
            <PortraitFrame photo={contact.photo} name={contact.name} initials={contact.initials} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-300">
            Your contact
          </p>
          <p className="mt-2 text-2xl font-medium leading-tight tracking-tight sm:text-[1.7rem]">
            {contact.name}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {contact.role}
          </p>
        </div>
      </div>

      <p className="relative mt-6 font-accent text-xl italic leading-snug text-brand-100 sm:text-2xl">
        &ldquo;{contact.note}&rdquo;
      </p>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${contact.email}`}
          className="group inline-flex items-center gap-2 rounded-full bg-white py-3 pl-6 pr-4 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
        >
          Email {contact.name.split(" ")[0]}
          <ArrowUpRight
            size={16}
            weight="bold"
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          {copied ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} aria-hidden />}
          <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
        </button>
      </div>
      <p className="relative mt-4 truncate text-[13px] text-brand-300">{contact.email}</p>
    </div>
  );
}

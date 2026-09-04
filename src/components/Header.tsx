"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import type { SiteData } from "@/lib/types";

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-content items-center justify-center gap-[74px] px-4 py-4 sm:px-6">
        <nav className="hidden items-center gap-[30px] rounded-full border border-white/15 bg-white/20 px-10 py-2 backdrop-blur-[10px] md:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[13px] font-normal text-white transition-colors hover:text-white ${
                  active ? "[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]" : "text-white/85"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center justify-center rounded-full border border-white/15 p-1.5 md:flex">
          <Link
            href={site.joinCta.href}
            className="flex h-[30px] w-[109px] items-center justify-center rounded-full border border-white/15 bg-white text-center text-sm font-bold text-black shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[7px] transition-colors hover:bg-brand-50"
          >
            {site.joinCta.label}
          </Link>
        </div>

        <div className="flex w-full items-center justify-between rounded-full bg-brand-950/55 px-4 py-2.5 backdrop-blur-md md:hidden">
          <Link href="/" className="text-sm font-semibold text-white" onClick={() => setOpen(false)}>
            STADS
          </Link>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="mx-4 mt-1 rounded-2xl bg-brand-950/95 px-4 py-4 backdrop-blur-md sm:mx-6 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-white/90 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={site.joinCta.href}
                className="block rounded-full bg-white px-4 py-3 text-center text-base font-semibold text-brand-900"
                onClick={() => setOpen(false)}
              >
                {site.joinCta.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

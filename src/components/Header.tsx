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
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <nav className="hidden items-center gap-1 rounded-full bg-brand-950/55 px-2 py-2 backdrop-blur-md md:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={site.joinCta.href}
          className="hidden shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-card transition-colors hover:bg-brand-100 md:block"
        >
          {site.joinCta.label}
        </Link>

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

"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import type { SiteData } from "@/lib/types";
import Logo from "./Logo";

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="border-b border-white/10 bg-brand-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white"
            onClick={() => setOpen(false)}
          >
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">STADS</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href={site.joinCta.href}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100"
            >
              {site.joinCta.label}
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="border-t border-white/10 bg-brand-950 px-4 py-4 md:hidden"
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
      </div>
    </header>
  );
}

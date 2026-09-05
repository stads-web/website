"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import type { SiteData } from "@/lib/types";

export default function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Three real columns rather than a centred group with an absolutely
          placed logo - that version collided once the viewport narrowed. */}
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="STADS home"
          className="hidden shrink-0 items-center lg:flex"
        >
          <Image
            src={scrolled ? "/images/stads_logo_dark.webp" : "/images/logo_hero.webp"}
            alt="STADS"
            width={351}
            height={109}
            priority
            className="h-auto w-[112px] transition-opacity duration-300 xl:w-[140px]"
          />
        </Link>

        <nav
          className={`mx-auto hidden items-center gap-5 rounded-full px-8 py-2 backdrop-blur-[10px] transition-colors duration-300 lg:flex xl:gap-[30px] xl:px-10 ${
            scrolled ? "border border-brand-100 bg-white/90 shadow-card" : "border border-white/15 bg-white/20"
          }`}
        >
          {site.nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[13px] font-normal transition-colors ${
                  scrolled
                    ? active
                      ? "text-brand-900"
                      : "text-brand-900/60 hover:text-brand-900"
                    : active
                      ? "text-white [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]"
                      : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* The button itself stays put; only the ring answers the cursor. */}
        <div className="group relative hidden shrink-0 items-center justify-center p-1.5 lg:flex">
          <span
            aria-hidden
            className={`border-beam ${scrolled ? "border-beam--dark" : ""}`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 scale-95 rounded-full border transition-all duration-500 group-hover:scale-100 ${
              scrolled
                ? "border-brand-100 group-hover:border-brand-200"
                : "border-white/15 group-hover:border-white/40"
            }`}
          />
          <Link
            href={site.joinCta.href}
            className="relative flex h-[30px] w-[109px] items-center justify-center rounded-full border border-white/15 bg-white text-center text-sm font-bold text-black shadow-[inset_0_0_6px_3px_rgba(255,255,255,0.25)] backdrop-blur-[7px] transition-transform duration-300 hover:scale-[1.04]"
          >
            {site.joinCta.label}
          </Link>
        </div>

        <div className="flex w-full items-center justify-between rounded-full bg-brand-950/55 px-4 py-2.5 backdrop-blur-md lg:hidden">
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
          className="mx-4 mt-1 rounded-2xl bg-brand-950/95 px-4 py-4 backdrop-blur-md sm:mx-6 lg:hidden"
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

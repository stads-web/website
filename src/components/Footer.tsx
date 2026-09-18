import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import CookieSettingsButton from "./CookieSettingsButton";
import Magnetic from "./motion/Magnetic";
import { iconMap } from "@/lib/icons";
import { readContent } from "@/lib/content";
import type { SiteData, HeroData } from "@/lib/types";

export default function Footer({ site }: { site: SiteData }) {
  // Reuse the homepage hero's own tagline (content/home/hero.md) so the
  // footer closes the site on the same line it opened with, rather than
  // inventing new copy just for this spot.
  const { data: hero } = readContent<HeroData>("home/hero.md");

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-900">
      {/* Solid white - the previous translucent fade let the page's fixed
          background blobs bleed through and wash out the text. */}
      <div className="relative bg-white">
        <div className="relative mx-auto max-w-content px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="max-w-[280px]">
              <Image
                src="/images/stads_logo_dark.webp"
                alt="STADS"
                width={351}
                height={109}
                className="h-auto w-40 sm:w-48"
              />
              <p className="mt-5 text-balance font-accent text-xl italic leading-snug text-brand-800/80 sm:text-2xl">
                {hero.taglineAccent}{" "}
                <span className="font-semibold not-italic text-brand-900">
                  {hero.taglineBold}
                </span>
              </p>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-6 inline-block text-[13px] text-brand-800/70 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
              >
                {site.contact.email}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-14">
              <div>
                <p className="text-sm font-medium text-brand-900">Pages</p>
                <ul className="mt-5 space-y-2.5">
                  {site.footer.pages.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-brand-800/70 transition-colors hover:text-brand-900"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-brand-900">Extras</p>
                <ul className="mt-5 space-y-2.5">
                  {site.footer.extras.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-brand-800/70 transition-colors hover:text-brand-900"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <CookieSettingsButton className="cursor-pointer text-left text-[13px] text-brand-800/70 transition-colors hover:text-brand-900" />
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm font-medium text-brand-900">Follow us</p>
                <div className="mt-5 flex gap-3">
                  {site.footer.social.map((social) => {
                    const Icon = iconMap[social.icon];
                    return (
                      <Magnetic key={social.href} strength={0.4}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-white text-brand-900 shadow-card transition-colors duration-300 hover:text-white"
                        >
                          <span
                            aria-hidden
                            className="absolute inset-0 scale-0 rounded-full bg-brand-900 transition-transform duration-300 ease-out group-hover:scale-100"
                          />
                          {Icon && (
                            <Icon
                              size={17}
                              className="relative z-10"
                              aria-hidden="true"
                            />
                          )}
                        </a>
                      </Magnetic>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A gradual climb into the dark bar - several stops rather than one
          straight ramp, since a two-stop gradient reads as an abrupt seam. */}
      <div
        aria-hidden
        className="h-28 bg-gradient-to-b from-white via-brand-200 via-40% to-brand-950 sm:h-40"
      />

      <div className="relative mx-auto max-w-content px-4 pb-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row sm:justify-between">
          <p>{site.footer.copyright}</p>
          <Magnetic strength={0.4}>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-brand-900"
            >
              <ArrowUp size={20} aria-hidden="true" />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}

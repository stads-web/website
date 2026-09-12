import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import CookieSettingsButton from "./CookieSettingsButton";
import RingLogo from "./RingLogo";
import Constellation from "./motion/Constellation";
import { iconMap } from "@/lib/icons";
import type { SiteData } from "@/lib/types";

export default function Footer({ site }: { site: SiteData }) {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-900">
      {/* Solid white, not a translucent fade the backdrop blobs bleed through -
          crisp, predictable contrast for the columns below. */}
      <div className="relative bg-white">
        {/* Oversized ring mark bleeding off the corner - a quiet signature. */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 sm:-right-8 sm:-top-24">
          <RingLogo className="h-[240px] w-[240px] text-brand-100 sm:h-[340px] sm:w-[340px]" />
        </div>

        <div className="relative mx-auto max-w-content px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-24">
          <div className="flex flex-col items-start gap-10 sm:flex-row sm:justify-between">
            <Image
              src="/images/stads_logo_dark.webp"
              alt="STADS"
              width={351}
              height={109}
              className="h-auto w-40 sm:w-48"
            />

            <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm font-medium text-brand-900">Pages</p>
                <ul className="mt-4 space-y-2">
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
                <ul className="mt-4 space-y-2">
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

              <div>
                <p className="text-sm font-medium text-brand-900">Follow us</p>
                <div className="mt-4 flex gap-2.5">
                  {site.footer.social.map((social) => {
                    const Icon = iconMap[social.icon];
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-900 shadow-card transition-colors hover:bg-brand-900 hover:text-white"
                      >
                        {Icon && <Icon size={16} aria-hidden="true" />}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A real transition into the dark bar - not a hard cut from white to navy. */}
      <div aria-hidden className="h-14 bg-gradient-to-b from-white to-brand-950 sm:h-20" />

      <div className="relative">
        <Constellation />
        <div className="relative mx-auto flex max-w-content flex-col items-center gap-4 px-4 pb-6 text-[13px] text-white/60 sm:flex-row sm:justify-between sm:px-6">
          <p>{site.footer.copyright}</p>
          <a
            href="#top"
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-brand-900"
          >
            <ArrowUp size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

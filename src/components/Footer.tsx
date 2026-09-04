import Link from "next/link";
import Logo from "./Logo";
import { iconMap } from "@/lib/icons";
import type { SiteData } from "@/lib/types";

export default function Footer({ site }: { site: SiteData }) {
  return (
    <footer className="bg-brand-950 text-white/70">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex items-center gap-2 text-white">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold">STADS</span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Pages
            </p>
            <ul className="mt-4 space-y-2">
              {site.footer.pages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Extras
            </p>
            <ul className="mt-4 space-y-2">
              {site.footer.extras.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Follow us
            </p>
            <div className="mt-4 flex gap-3">
              {site.footer.social.map((social) => {
                const Icon = iconMap[social.icon];
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:text-white"
                  >
                    {Icon && <Icon size={18} aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          {site.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

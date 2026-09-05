"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react";
import Magnetic from "../motion/Magnetic";

/**
 * Two-click embed: nothing is requested from LinkedIn until the visitor asks
 * for it, so the page stays free of third-party cookies on load.
 */
export default function VideoEmbed({
  embed,
  link,
  poster,
  posterAlt,
  title,
}: {
  embed: string;
  link: string;
  poster: string;
  posterAlt: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="overflow-hidden rounded-[32px] border border-brand-100 bg-white shadow-[0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
        <iframe
          src={embed}
          title={title}
          allowFullScreen
          className="h-[560px] w-full sm:h-[640px]"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0px_15px_30px_rgba(0,0,0,0.06),0px_30px_60px_rgba(0,0,0,0.12)]">
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="relative block aspect-video w-full"
        aria-label={`${title} - load video from LinkedIn`}
      >
        <Image
          src={poster}
          alt={posterAlt}
          fill
          sizes="(min-width: 1024px) 900px, 100vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/35 to-brand-950/20" />

        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Magnetic strength={0.4}>
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-900 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play size={28} weight="fill" aria-hidden="true" />
            </span>
          </Magnetic>
          <span className="text-sm font-medium text-white">Watch on LinkedIn</span>
        </span>
      </button>
      </div>

      <p className="mt-3 text-xs text-brand-900/45">
        Loads content from LinkedIn only after you click.{" "}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-brand-900"
        >
          Open on LinkedIn instead
        </a>
      </p>
    </div>
  );
}

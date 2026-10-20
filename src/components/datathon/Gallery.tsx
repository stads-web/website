import Image from "next/image";
import type { GalleryData } from "@/lib/types";

/** Swipeable photo strip, phones and tablets only (CSS scroll-snap, no JS). */
export default function Gallery({ data }: { data: GalleryData }) {
  return (
    <section aria-label="Datathon photos" className="pt-16 lg:hidden">
      <div className="mx-auto max-w-content">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-10 pt-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.items.map((item) => (
            <li
              key={item.image}
              className="relative aspect-[4/3] w-[80vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-[32px] border border-white/60 shadow-[0px_15px_30px_rgba(0,0,0,0.06),0px_30px_60px_rgba(0,0,0,0.12)]"
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="80vw"
                loading="lazy"
                className="object-cover"
                style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

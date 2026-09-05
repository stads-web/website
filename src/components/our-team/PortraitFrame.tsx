import Image from "next/image";

/**
 * Shows a real portrait once one exists, and a designed monogram panel until
 * then - so a missing photo reads as intentional rather than broken.
 */
export default function PortraitFrame({
  photo,
  name,
  initials,
}: {
  photo?: string;
  name: string;
  initials: string;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        fill
        sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950">
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[5.5rem] font-medium tracking-tight text-white/[0.09]"
      >
        {initials}
      </span>
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-950/80 to-transparent"
      />
    </div>
  );
}

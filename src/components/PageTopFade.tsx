import Image from "next/image";

export default function PageTopFade() {
  return (
    <div className="relative h-[320px] w-full bg-gradient-to-b from-brand-800 to-white sm:h-[420px]">
      <Image
        src="/images/logo_hero.webp"
        alt="STADS - Students' Association for Data Analytics & Statistics"
        width={658}
        height={205}
        priority
        className="absolute left-4 top-24 h-auto w-[160px] sm:left-6 sm:top-28 sm:w-[200px]"
      />
    </div>
  );
}

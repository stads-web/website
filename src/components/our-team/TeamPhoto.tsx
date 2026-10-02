import Image from "next/image";
import Reveal from "../motion/Reveal";
import SectionHeading from "../motion/SectionHeading";

export default function TeamPhoto() {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-24">
      <SectionHeading
        eyebrow="Teams & Departments"
        title="One team, seven departments"
        align="center"
      />
      <Reveal y={16} className="mx-auto mt-10 max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-brand-100 shadow-[0px_5px_10px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.05),0px_30px_60px_rgba(0,0,0,0.1)]">
          <Image
            src="/images/team/team.webp"
            alt="Das STADS-Team"
            width={4266}
            height={3197}
            quality={95}
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </Reveal>
    </section>
  );
}

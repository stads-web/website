import SectionHeading from "../motion/SectionHeading";
import LogoMarquee from "../motion/LogoMarquee";
import type { Partner, TrustWallData } from "@/lib/types";

export default function TrustWall({
  data,
  logos,
}: {
  data: TrustWallData;
  logos: Partner[];
}) {
  return (
    <section className="overflow-hidden bg-brand-950 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} tone="light" />
      </div>

      <div className="mt-14">
        <LogoMarquee logos={logos} />
      </div>
    </section>
  );
}

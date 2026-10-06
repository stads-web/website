import Image from "next/image";
import Constellation from "./motion/Constellation";

/**
 * The navy-to-white band every non-hero page opens with. The logo now lives in
 * the header, so this is purely atmosphere: a drifting node graph on brand navy.
 */
export default function PageTopFade({ image }: { image?: string }) {
  return (
    // The band fades out through a mask instead of ending in an opaque white
    // edge: below it the page is transparent over the drifting backdrop, and an
    // opaque white bottom showed up as a hard line against the backdrop's glow.
    <div className="relative h-[220px] w-full overflow-hidden bg-gradient-to-b from-brand-800 to-transparent [-webkit-mask-image:linear-gradient(to_bottom,#000_55%,transparent)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] sm:h-[280px]">
      {image && (
        <>
          <Image src={image} alt="" fill priority quality={95} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/35 to-transparent" />
        </>
      )}
      <Constellation />
    </div>
  );
}

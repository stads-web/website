import Constellation from "./motion/Constellation";

/**
 * The navy-to-white band every non-hero page opens with. The logo now lives in
 * the header, so this is purely atmosphere: a drifting node graph on brand navy.
 */
export default function PageTopFade() {
  return (
    <div className="relative h-[220px] w-full overflow-hidden bg-gradient-to-b from-brand-800 to-white sm:h-[280px]">
      <Constellation />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

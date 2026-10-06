import Image from "next/image";
import type { Partner } from "@/lib/types";

/**
 * One partner mark, sized by optical weight rather than by a shared max-height.
 * Every logo is a trimmed, single-colour (white) file, so what is left to
 * balance is shape: width ~ sqrt(aspect), height ~ 1/sqrt(aspect) keeps a wide
 * wordmark and a tall monogram at the same visual mass. `--logo-u` is the unit
 * the caller sets; the box never exceeds its tile.
 */
export default function PartnerLogo({ partner }: { partner: Partner }) {
  const root = Math.sqrt(partner.aspect);
  return (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={Math.round(100 * partner.aspect)}
      height={100}
      unoptimized
      style={{
        width: `calc(var(--logo-u) * ${root.toFixed(3)})`,
        height: `calc(var(--logo-u) * ${(1 / root).toFixed(3)})`,
      }}
      className="max-h-full max-w-full object-contain"
    />
  );
}

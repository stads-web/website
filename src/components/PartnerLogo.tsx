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

/** Props that turn a tile into a new-tab link to the partner homepage. `hidden` = decorative loop copy. */
export function partnerLinkProps(partner: Partner, hidden = false) {
  if (!partner.href) return {};
  return {
    href: partner.href,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": `${partner.name} (opens in a new tab)`,
    ...(hidden ? { tabIndex: -1 } : {}),
  };
}

export const partnerLinkClass =
  "transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

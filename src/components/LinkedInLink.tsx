import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

/** Shared look of the round pill buttons (LinkedIn, testimonial translate): size, border and colour fill. */
export const pillBase =
  "inline-flex h-11 items-center rounded-full border transition-[background-color,border-color,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
export const pillSkin = {
  glass:
    "border-white/30 bg-brand-950/35 text-white backdrop-blur-sm [@media(hover:hover)]:hover:border-white active:border-white [@media(hover:hover)]:hover:bg-white active:bg-white [@media(hover:hover)]:hover:text-brand-900 active:text-brand-900 focus-visible:border-white focus-visible:bg-white focus-visible:text-brand-900",
  ink: "border-brand-200 bg-white text-brand-800 [@media(hover:hover)]:hover:border-brand-800 active:border-brand-800 [@media(hover:hover)]:hover:bg-brand-800 active:bg-brand-800 [@media(hover:hover)]:hover:text-white active:text-white focus-visible:border-brand-800 focus-visible:bg-brand-800 focus-visible:text-white",
};

/**
 * Round LinkedIn button. With a pointer it opens into a pill and says what it
 * is (`expand`); on touch (and for keyboard focus) it is simply the icon with a
 * full-size tap area. Turn `expand` off where there is no room to grow (name
 * captions): the button then stays a fixed circle and only changes colour.
 * "glass" sits on photos, "ink" on white. Hover colours only with a real pointer
 * (no sticky hover after a tap); touch gets the same colours while pressed.
 */
export default function LinkedInLink({
  href,
  name,
  tone = "ink",
  expand = true,
  touchOpen = false,
  className = "",
  tabIndex,
}: {
  href: string;
  name: string;
  tone?: "glass" | "ink";
  expand?: boolean;
  /** Show the label open on touch devices (no hover there). */
  touchOpen?: boolean;
  className?: string;
  tabIndex?: number;
}) {
  const skin = pillSkin[tone];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      aria-label={`${name} on LinkedIn`}
      className={`group/li ${pillBase} px-[11px] ${skin} ${className}`}
    >
      <LinkedinLogo size={20} weight="fill" aria-hidden />
      {expand && (
      <span
        aria-hidden
        className={`${touchOpen ? "[@media(hover:none)]:ml-2.5 [@media(hover:none)]:mr-1 [@media(hover:none)]:max-w-[5rem] [@media(hover:none)]:opacity-100 " : ""}max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/li:ml-2.5 group-hover/li:mr-1 group-hover/li:max-w-[5rem] group-hover/li:opacity-100 group-focus-visible/li:ml-2.5 group-focus-visible/li:mr-1 group-focus-visible/li:max-w-[5rem] group-focus-visible/li:opacity-100 motion-reduce:transition-none`}
      >
        LinkedIn
      </span>
      )}
    </a>
  );
}

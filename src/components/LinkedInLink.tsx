import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

/**
 * Round LinkedIn button. With a pointer it opens into a pill and says what it
 * is (`expand`); on touch (and for keyboard focus) it is simply the icon with a
 * full-size tap area. Turn `expand` off where there is no room to grow (name
 * captions): the button then stays a fixed circle and only changes colour.
 * "glass" sits on photos, "ink" on white.
 */
export default function LinkedInLink({
  href,
  name,
  tone = "ink",
  expand = true,
  className = "",
}: {
  href: string;
  name: string;
  tone?: "glass" | "ink";
  expand?: boolean;
  className?: string;
}) {
  const skin =
    tone === "glass"
      ? "border-white/30 bg-brand-950/35 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand-900 focus-visible:border-white focus-visible:bg-white focus-visible:text-brand-900"
      : "border-brand-200 bg-white text-brand-800 hover:border-brand-800 hover:bg-brand-800 hover:text-white focus-visible:border-brand-800 focus-visible:bg-brand-800 focus-visible:text-white";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className={`group/li inline-flex h-11 items-center rounded-full border px-[11px] transition-[background-color,border-color,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${skin} ${className}`}
    >
      <LinkedinLogo size={20} weight="fill" aria-hidden />
      {expand && (
      <span
        aria-hidden
        className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/li:ml-2.5 group-hover/li:mr-1 group-hover/li:max-w-[5rem] group-hover/li:opacity-100 group-focus-visible/li:ml-2.5 group-focus-visible/li:mr-1 group-focus-visible/li:max-w-[5rem] group-focus-visible/li:opacity-100 motion-reduce:transition-none"
      >
        LinkedIn
      </span>
      )}
    </a>
  );
}

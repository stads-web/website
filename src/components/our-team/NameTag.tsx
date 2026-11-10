import LinkedInLink from "../LinkedInLink";

/**
 * Caption under a portrait: the person's name on the left, their role as a
 * small outlined tag on the right, over a hairline that spans the photo's
 * width. Used for the board and for every department lead, so a name always
 * reads the same way.
 *
 * The name is a real heading and, when the tag sits in a <figure>, the tag
 * itself is the <figcaption> (`as="figcaption"`) - both purely semantic, so
 * search engines can tie name and portrait together. The look is unchanged:
 * the heading keeps the body font instead of the global h1-h6 font.
 */
export default function NameTag({
  name,
  role,
  linkedin,
  className = "",
  as: Root = "div",
}: {
  name: string;
  role: string;
  linkedin?: string;
  className?: string;
  as?: "div" | "figcaption";
}) {
  return (
    <Root
      className={`flex items-center justify-between gap-3 border-t border-brand-100 pt-4 ${className}`}
    >
      <h3 className="min-w-0 text-xl font-medium leading-tight tracking-tight text-brand-900 [font-family:inherit]">
        {name}
      </h3>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full border border-brand-200 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-brand-600">
          {role}
        </span>
        {linkedin && <LinkedInLink href={linkedin} name={name} expand={false} className="-my-2" />}
      </div>
    </Root>
  );
}

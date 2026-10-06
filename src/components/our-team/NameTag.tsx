/**
 * Caption under a portrait: the person's name on the left, their role as a
 * small outlined tag on the right, over a hairline that spans the photo's
 * width. Used for the board and for every department lead, so a name always
 * reads the same way.
 */
export default function NameTag({
  name,
  role,
  className = "",
}: {
  name: string;
  role: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-t border-brand-100 pt-4 ${className}`}
    >
      <p className="min-w-0 text-xl font-medium leading-tight tracking-tight text-brand-900">
        {name}
      </p>
      <span className="shrink-0 rounded-full border border-brand-200 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-brand-600">
        {role}
      </span>
    </div>
  );
}

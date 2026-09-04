/**
 * Placeholder abstract "ring" mark used in the hero lockup - swap for the
 * real STADS logo file once available. Color is controlled via currentColor,
 * so set it with a text-* className on the wrapper.
 */
export default function RingLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="STADS logo"
    >
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="185 60"
        strokeDashoffset="10"
      />
      <circle cx="26" cy="70" r="4" fill="currentColor" />
    </svg>
  );
}

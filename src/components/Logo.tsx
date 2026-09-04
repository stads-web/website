/**
 * Placeholder mark - swap for the real STADS logo file once available.
 * Keep the export signature (className prop) so call sites don't need to change.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="STADS logo"
    >
      <circle cx="20" cy="20" r="19" fill="#7388B0" />
      <circle cx="20" cy="20" r="19" fill="none" stroke="#203765" strokeWidth="1.5" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="17"
        fontWeight="700"
        fill="#0F1D36"
      >
        S
      </text>
    </svg>
  );
}

const blob = (color: string) =>
  `radial-gradient(circle at center, ${color} 0%, transparent 68%)`;

export default function MeshBackdrop() {
  return (
    <div
      aria-hidden
      // Stop short of the footer (--footer-h, published by FooterReveal) - being
      // `fixed`, this would otherwise keep painting on top of it forever, no
      // matter what background the footer itself sets.
      className="pointer-events-none fixed inset-x-0 top-0 bottom-[var(--footer-h)] z-0 overflow-hidden"
    >
      <div
        className="animate-drift-a absolute -left-[15%] top-[8%] h-[55vw] w-[55vw] max-h-[720px] max-w-[720px]"
        style={{ backgroundImage: blob("rgba(115,136,176,0.30)") }}
      />
      <div
        className="animate-drift-b absolute -right-[12%] top-[38%] h-[48vw] w-[48vw] max-h-[640px] max-w-[640px]"
        style={{ backgroundImage: blob("rgba(32,55,101,0.16)") }}
      />
      <div
        className="animate-drift-c absolute bottom-[6%] left-[22%] h-[42vw] w-[42vw] max-h-[560px] max-w-[560px]"
        style={{ backgroundImage: blob("rgba(168,183,209,0.32)") }}
      />
    </div>
  );
}

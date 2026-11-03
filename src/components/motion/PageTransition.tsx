"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // First load: no fade-in, so the server HTML is visible at once. Once the
  // path has changed (idempotent, so StrictMode-safe) every page animates.
  const startPath = useRef(pathname);
  const navigated = useRef(false);
  if (pathname !== startPath.current) navigated.current = true;
  const skip = !navigated.current;

  return (
    <motion.div
      key={pathname}
      initial={skip ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

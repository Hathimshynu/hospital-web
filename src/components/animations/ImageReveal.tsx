"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/animations";

/** Clip-path unveil for large images. The image stays in the DOM (and crawlable) the whole time. */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0 round 28px)" }} whileInView={{ clipPath: "inset(0 0% 0 0 round 28px)" }}
      viewport={viewportOnce} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

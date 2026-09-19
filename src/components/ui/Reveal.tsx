"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/animations";

/** Scroll-reveal wrapper: fade + slight upward movement. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "article" }) {
  const M = motion[as];
  return (
    <M className={className} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={viewportOnce}>
      {children}
    </M>
  );
}

/** Line-by-line masked text reveal. Pass lines explicitly to control wrapping. */
export function TextReveal({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        // The observed element is the (unclipped) mask; the line inside animates via variant propagation.
        <motion.span key={i} className="block overflow-hidden pb-[0.12em]" initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: 0 } }}
            transition={{ duration: 0.9, delay: delay + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

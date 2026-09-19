"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fadeUp, viewportOnce } from "@/lib/animations";

/** Card with scroll-reveal and a hover/focus lift (lift is decorative; nothing depends on hover). */
export function AnimatedCard({ children, className, delay = 0, as = "div" }: {
  children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article";
}) {
  const M = motion[as];
  return (
    <M
      className={cn(
        "rounded-3xl border border-navy-950/10 bg-white transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1.5 hover:border-brand-500/40 hover:shadow-[0_26px_50px_-26px_rgba(8,35,59,0.35)]",
        className,
      )}
      data-cursor="card"
      variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={viewportOnce}
    >
      {children}
    </M>
  );
}

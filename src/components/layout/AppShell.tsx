"use client";

import type { ReactNode } from "react";
import { GlowCursor } from "./GlowCursor";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-brand-600 to-brand-400"
    />
  );
}

/** Global client wrapper: honours prefers-reduced-motion for every Framer animation. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <GlowCursor />
      {children}
    </MotionConfig>
  );
}

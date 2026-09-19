"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useDeviceTier";
import { tiltSpring } from "@/lib/animations";

/**
 * Subtle pointer-driven 3D tilt. Purely decorative: it only runs for a real
 * mouse and never when the visitor prefers reduced motion, so nothing depends on it.
 */
export function Tilt3D({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const on = fine && !reduced;
  const rx = useSpring(useMotionValue(0), tiltSpring);
  const ry = useSpring(useMotionValue(0), tiltSpring);

  const move = (e: React.PointerEvent) => {
    if (!on || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }} onPointerMove={move} onPointerLeave={reset}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

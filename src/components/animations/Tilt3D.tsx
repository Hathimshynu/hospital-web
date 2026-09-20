import type { ReactNode } from "react";

/**
 * Subtle 3D tilt wrapper. A SERVER component: it only marks the element; a single delegated
 * pointer handler (layout/GlobalEffects) sets --rx / --ry for real mice, and CSS does the rest.
 * Touch devices and reduced-motion users never tilt.
 */
export function Tilt3D({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  return (
    <div data-tilt={max} className={className}>
      <div className="tilt-inner h-full">{children}</div>
    </div>
  );
}

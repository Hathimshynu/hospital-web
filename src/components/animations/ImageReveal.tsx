import type { ReactNode } from "react";

/**
 * Clip-path unveil for large images (CSS). The observed wrapper is never clipped; only the inner
 * element is, otherwise the browser would treat it as invisible and the reveal would never fire.
 * Server component - no client JS.
 */
export function ImageReveal({ children, className, from = "left" }: { children: ReactNode; className?: string; from?: "left" | "up" }) {
  return (
    <div className={className} data-reveal-clip="">
      <div className={from === "up" ? "reveal-clip reveal-up" : "reveal-clip"}>{children}</div>
    </div>
  );
}

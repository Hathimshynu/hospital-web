import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card with scroll reveal and a hover/focus lift. Server component - CSS only. */
export function AnimatedCard({ children, className, delay = 0, as: Tag = "div" }: {
  children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      data-reveal="" data-cursor="card" style={{ "--d": `${delay}s` } as CSSProperties}
      className={cn(
        "rounded-3xl border border-navy-950/10 bg-white transition-[translate,box-shadow,border-color] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1.5 hover:border-brand-500/40 hover:shadow-[0_26px_50px_-26px_rgba(8,35,59,0.35)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

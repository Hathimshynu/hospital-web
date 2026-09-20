import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll reveal (fade + slight rise). A SERVER component: it only renders an attribute that the
 * single global IntersectionObserver (layout/GlobalEffects) picks up, so it adds no client JS
 * per instance. Without JavaScript the content is simply visible.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "article" }) {
  return (
    <Tag className={className} data-reveal="" style={{ "--d": `${delay}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Line-by-line masked text reveal (CSS). Pass lines explicitly to control wrapping. */
export function TextReveal({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className} data-reveal-group="">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <span className="reveal-line block" style={{ "--d": `${delay + i * 0.1}s` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </span>
  );
}

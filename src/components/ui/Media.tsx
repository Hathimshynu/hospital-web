import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types";
import { Icon } from "./Icon";

/**
 * Responsive image slot. With `src` it renders an optimised next/image
 * (AVIF/WebP, responsive srcset). Without one it renders a designed fallback
 * (or the `fallback` node) so nothing is ever a broken image.
 * The wrapper always has a fixed aspect ratio -> no layout shift.
 */
export function Media({
  src, alt, icon = "heart", fallback, className, sizes = "(min-width: 1024px) 50vw, 100vw",
  preload, zoom, objectPosition = "center",
}: {
  src?: string;
  alt: string;
  icon?: IconName;
  fallback?: ReactNode;
  className?: string;
  sizes?: string;
  /** LCP image: preloaded and fetched with high priority */
  preload?: boolean;
  zoom?: boolean;
  objectPosition?: string;
}) {
  return (
    <div data-cursor="image" className={cn("relative overflow-hidden bg-mint", className)}>
      {src ? (
        <Image
          src={src} alt={alt} fill sizes={sizes} preload={preload} quality={80}
          style={{ objectPosition }}
          className={cn("object-cover", zoom && "transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.03]")}
        />
      ) : fallback ? (
        <div role="img" aria-label={alt} className="absolute inset-0">{fallback}</div>
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-gradient-to-br from-mint via-white to-brand-300/40">
          <span className="grid size-16 place-items-center rounded-2xl bg-white/80 text-brand-600 shadow-sm ring-1 ring-brand-500/15">
            <Icon name={icon} className="size-8" />
          </span>
        </div>
      )}
      {zoom && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
    </div>
  );
}

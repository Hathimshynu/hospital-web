import Link from "next/link";
import { hospital } from "@/data/hospital";
import { cn } from "@/lib/utils";

/** Brand mark: swap this SVG for the hospital's official logo when supplied. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#27C4C8" /><stop offset="1" stopColor="#0B7F88" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#lm)" />
      <path d="M17 9h6v8h8v6h-8v8h-6v-8H9v-6h8z" fill="#fff" />
    </svg>
  );
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${hospital.name} - home`} className={cn("inline-flex min-h-11 items-center gap-3", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-bold tracking-tight", light ? "text-white" : "text-navy-950")}>{hospital.name}</span>
        <span className={cn("mt-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] max-[359px]:hidden sm:text-[10px] sm:tracking-[0.2em]", light ? "text-brand-300" : "text-brand-700")}>{hospital.tagline}</span>
      </span>
    </Link>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 16px text (prevents iOS zoom-on-focus) and a 48px touch target. */
export const inputClass = (invalid?: boolean) =>
  cn(
    "min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-base text-navy-950 outline-none transition-colors duration-200 placeholder:text-slate-body/60 focus:ring-2",
    invalid ? "border-coral focus:border-coral focus:ring-coral/25" : "border-navy-950/15 focus:border-brand-600 focus:ring-brand-500/25",
  );

export function Field({ id, label, error, children, className, required }: {
  id: string; label: string; error?: string; children: ReactNode; className?: string; required?: boolean;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-950">
        {label}{required && <span aria-hidden="true" className="text-coral"> *</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-[#c0392b]">{error}</p>}
    </div>
  );
}

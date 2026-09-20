"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/hospital";
import { cn } from "@/lib/utils";

/** Desktop links. Client only for usePathname (current-page underline); all motion is CSS. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex">
      {nav.map((n) => {
        const active = n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(n.href + "/");
        return (
          <Link
            key={n.href} href={n.href} aria-current={active ? "page" : undefined}
            className={cn("nav-link text-sm font-semibold", active ? "text-brand-700" : "text-navy-950 hover:text-brand-700")}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

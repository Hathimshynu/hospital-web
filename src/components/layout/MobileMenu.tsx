"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { hospital, nav, telHref, urgentPhone } from "@/data/hospital";
import { cn } from "@/lib/utils";

/**
 * Slide-in menu (CSS enter/leave). Closes on link tap, backdrop tap and Escape; locks page scroll;
 * keeps keyboard focus inside the panel.
 */
export function MobileMenu({ leaving, onClose, pathname }: { leaving: boolean; onClose: () => void; pathname: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Lock page scroll one frame AFTER the menu has painted: locking forces a relayout of the whole
    // (long) page, which would otherwise sit inside the tap's response time.
    const prevOverflow = document.body.style.overflow;
    const raf = requestAnimationFrame(() => { document.body.style.overflow = "hidden"; });
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = prevOverflow; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const phone = urgentPhone();

  return (
    <div className={cn("fixed inset-0 z-[150] xl:hidden", leaving && "menu-leaving")}>
      <div className="menu-scrim absolute inset-0 bg-navy-950/55" onClick={onClose} />
      <div
        ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu"
        className="menu-panel absolute inset-y-0 right-0 flex h-[100dvh] w-full flex-col overflow-y-auto bg-white sm:max-w-sm"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-5">
          <Logo />
          <button ref={closeBtn} onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-mint text-navy-950">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-5 pt-2">
          <ul className="menu-list">
            {nav.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <li key={n.href}>
                  <Link
                    href={n.href} onClick={onClose} aria-current={active ? "page" : undefined}
                    className={cn("flex min-h-14 items-center justify-between border-b border-navy-950/8 text-xl font-semibold", active ? "text-brand-700" : "text-navy-950")}
                  >
                    {n.label}
                    {active && <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
          <a href={telHref(phone)} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-navy-950/15 font-semibold text-navy-950">
            <Phone className="size-4" aria-hidden="true" /> Call {phone.display}
          </a>
          <WhatsAppButton className="w-full">Book Appointment on WhatsApp</WhatsAppButton>
          <p className="pt-1 text-center text-xs text-slate-body">{hospital.name} · {hospital.tagline}</p>
        </div>
      </div>
    </div>
  );
}

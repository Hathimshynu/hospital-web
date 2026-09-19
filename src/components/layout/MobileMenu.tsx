"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { hospital, nav, telHref, urgentPhone } from "@/data/hospital";
import { cn } from "@/lib/utils";

/**
 * Slide-in full-height menu. Closes on link tap, backdrop tap and Escape;
 * locks page scroll while open; keeps keyboard focus inside the panel.
 */
export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

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
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const phone = urgentPhone();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] xl:hidden">
          <motion.div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex h-[100dvh] w-full flex-col overflow-y-auto bg-white sm:max-w-sm"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-5">
              <Logo />
              <button ref={closeBtn} onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-mint text-navy-950">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="px-5 pt-2">
              <ul>
                {nav.map((n, i) => {
                  const active = n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(n.href + "/");
                  return (
                    <motion.li key={n.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.045, duration: 0.45 }}>
                      <Link
                        href={n.href} onClick={onClose} aria-current={active ? "page" : undefined}
                        className={cn("flex min-h-14 items-center justify-between border-b border-navy-950/8 text-xl font-semibold", active ? "text-brand-700" : "text-navy-950")}
                      >
                        {n.label}
                        {active && <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />}
                      </Link>
                    </motion.li>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

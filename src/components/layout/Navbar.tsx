"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileMenu } from "./MobileMenu";
import { appointmentUrl } from "@/lib/whatsapp";
import { hospital, nav, telHref, urgentPhone } from "@/data/hospital";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Menu state is tied to the route it was opened on, so navigating always closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const phone = urgentPhone();
  const label = hospital.contact.emergency ? "Emergency" : "Call Us";
  const iconBtn = "grid size-11 place-items-center rounded-full transition-colors";

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] bg-white/90 backdrop-blur-xl transition-[height,box-shadow] duration-300",
        scrolled ? "shadow-[0_10px_30px_-18px_rgba(8,35,59,0.35)]" : "shadow-[0_1px_0_rgba(8,35,59,0.06)]",
      )}
    >
      <div className={cn("container-x flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-16" : "h-[4.5rem]")}>
        <Logo />

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

        {/* Desktop */}
        <div className="hidden items-center gap-4 xl:flex">
          <a href={telHref(phone)} className="flex items-center gap-2.5 text-sm font-bold text-navy-950">
            <span className="grid size-9 place-items-center rounded-full bg-coral/15 text-coral"><Phone className="size-4" aria-hidden="true" /></span>
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-body">{label}</span>
              {phone.display}
            </span>
          </a>
          <WhatsAppButton icon={false} arrow variant="primary" className="min-h-11 px-5">Book Appointment</WhatsAppButton>
        </div>

        {/* Mobile / tablet: call, WhatsApp, hamburger */}
        <div className="flex items-center gap-1 xl:hidden">
          <a href={telHref(phone)} aria-label={`${label}: ${phone.display}`} className={cn(iconBtn, "bg-coral/12 text-coral hover:bg-coral/20")}>
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <a href={appointmentUrl()} target="_blank" rel="noopener noreferrer" aria-label="Book appointment on WhatsApp" className={cn(iconBtn, "bg-wa/10 text-wa hover:bg-wa/20")}>
            <MessageCircle className="size-5" aria-hidden="true" />
          </a>
          <button
            className={cn(iconBtn, "text-navy-950 hover:bg-mint")}
            aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu"
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <span className="relative block h-3.5 w-6" aria-hidden="true">
              <span className="absolute left-0 top-0 h-0.5 w-6 rounded bg-current" />
              <span className="absolute left-0 top-[6px] h-0.5 w-4 rounded bg-current" />
              <span className="absolute left-0 top-3 h-0.5 w-6 rounded bg-current" />
            </span>
          </button>
        </div>
      </div>

    </header>
    {/* Sibling of <header>: backdrop-filter on the header would otherwise become the containing block for this fixed overlay */}
    <MobileMenu open={open} onClose={() => setOpenFor(null)} pathname={pathname} />
    </>
  );
}

import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { appointmentUrl } from "@/lib/whatsapp";
import { hospital, telHref, urgentPhone } from "@/data/hospital";

const iconBtn = "grid size-11 place-items-center rounded-full transition-colors";

/**
 * Server component. Only NavLinks (active-page underline) and MobileNav (menu state) hydrate.
 * The scrolled look is driven by html[data-scrolled] from a single IntersectionObserver.
 */
export function Navbar() {
  const phone = urgentPhone();
  const label = hospital.contact.emergency ? "Emergency" : "Call Us";
  return (
    <header className="site-header fixed inset-x-0 top-0 z-[100] bg-white/95">
      <div className="site-bar container-x flex items-center justify-between gap-4">
        <Logo />
        <NavLinks />

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

        {/* Mobile / tablet: call + WhatsApp + menu */}
        <div className="flex items-center gap-1 xl:hidden">
          <a href={telHref(phone)} aria-label={`${label}: ${phone.display}`} className={`${iconBtn} bg-coral/12 text-coral hover:bg-coral/20`}>
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <a href={appointmentUrl()} target="_blank" rel="noopener noreferrer" aria-label="Book appointment on WhatsApp" className={`${iconBtn} bg-wa/10 text-wa hover:bg-wa/20`}>
            <MessageCircle className="size-5" aria-hidden="true" />
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { MapPin, MessageCircle, Phone, Siren, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { listedDepartments } from "@/data/departments";
import { services } from "@/data/services";
import { fullAddress, hospital, nav, telHref } from "@/data/hospital";
import { appointmentUrl } from "@/lib/whatsapp";

const link = "inline-flex min-h-11 items-center lg:min-h-9 text-sm text-white/75 transition-colors hover:text-white";
const h = "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-300";

export function Footer() {
  const c = hospital.contact;
  return (
    <footer className="on-dark bg-navy-950 pb-24 text-white xl:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:gap-12 lg:py-16">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">{hospital.description}</p>
          {hospital.social.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social media">
              {hospital.social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-xs font-semibold hover:border-brand-300">{s.label}</a></li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Quick links">
          <h2 className={h}>Quick Links</h2>
          <ul>{nav.map((n) => <li key={n.href}><Link href={n.href} className={link}>{n.label}</Link></li>)}</ul>
        </nav>

        <div className="grid gap-8">
          <nav aria-label="Departments">
            <h2 className={h}>Departments</h2>
            <ul>{listedDepartments.map((d) => <li key={d.slug}><Link href={`/departments/${d.slug}`} className={link}>{d.name}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Services">
            <h2 className={h}>Services</h2>
            <ul>{services.map((s) => <li key={s.slug}><Link href="/services" className={link}>{s.name}</Link></li>)}</ul>
          </nav>
        </div>

        <address className="not-italic sm:col-span-2 lg:col-span-1">
          <h2 className={h}>Contact</h2>
          <ul className="space-y-1 text-sm text-white/80">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" /><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-white">{fullAddress()}</a></li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" /><span>Phone: <a href={telHref(c.phone)} className="inline-flex min-h-11 items-center font-semibold text-white">{c.phone.display}</a></span></li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" /><span>Mobile: <a href={telHref(c.mobile)} className="inline-flex min-h-11 items-center font-semibold text-white">{c.mobile.display}</a></span></li>
            <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" /><span>WhatsApp: <a href={appointmentUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-white">{c.whatsapp.display}</a></span></li>
            {c.emergency && <li className="flex gap-3"><Siren className="mt-0.5 size-4 shrink-0 text-coral" aria-hidden="true" /><span>Emergency: <a href={telHref(c.emergency)} className="font-semibold text-white">{c.emergency.display}</a></span></li>}
            {c.email && <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" /><a href={`mailto:${c.email}`} className="hover:text-white">{c.email}</a></li>}
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {hospital.name}. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><Link href="/privacy-policy" className="inline-flex min-h-11 items-center hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="inline-flex min-h-11 items-center hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

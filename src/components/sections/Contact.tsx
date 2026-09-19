import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Siren } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { directionsUrl, fullAddress, hospital, mapEmbedUrl, telHref } from "@/data/hospital";
import { appointmentUrl } from "@/lib/whatsapp";

export function ContactInfo() {
  const c = hospital.contact;
  const rows = [
    { Icon: MapPin, label: "Address", value: fullAddress(), href: undefined as string | undefined },
    { Icon: Phone, label: "Phone", value: c.phone.display, href: telHref(c.phone) },
    { Icon: Phone, label: "Mobile", value: c.mobile.display, href: telHref(c.mobile) },
    { Icon: MessageCircle, label: "WhatsApp", value: c.whatsapp.display, href: appointmentUrl() },
    ...(c.emergency ? [{ Icon: Siren, label: "Emergency", value: c.emergency.display, href: telHref(c.emergency) }] : []),
    ...(c.email ? [{ Icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` }] : []),
  ];
  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {rows.map(({ Icon, label, value, href }) => (
          <li key={label} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-brand-600"><Icon className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-body">{label}</p>
              {href
                ? <a href={href} {...(label === "WhatsApp" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center font-semibold text-navy-950 hover:text-brand-700">{value}</a>
                : <p className="font-semibold text-navy-950">{value}</p>}
            </div>
          </li>
        ))}
      </ul>
      {hospital.hours && (
        <div className="rounded-2xl bg-mist p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-950"><Clock className="size-4 text-brand-600" aria-hidden="true" /> Opening hours</p>
          <dl className="space-y-2 text-sm">
            {hospital.hours.map((h) => <div key={h.label} className="flex justify-between gap-4"><dt className="text-slate-body">{h.label}</dt><dd className="text-right font-semibold text-navy-950">{h.value}</dd></div>)}
          </dl>
        </div>
      )}
    </div>
  );
}

export function MapEmbed({ className = "h-[20rem] sm:h-[24rem]" }: { className?: string }) {
  return (
    <div id="map" className={`overflow-hidden rounded-3xl border border-navy-950/10 bg-mint ${className}`}>
      <iframe title={`Map showing ${hospital.name}, ${hospital.address.locality}`} src={mapEmbedUrl()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full border-0" allowFullScreen />
    </div>
  );
}

export function ContactActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button href={telHref(hospital.contact.phone)} variant="primary"><Phone className="size-5" aria-hidden="true" /> Call Now</Button>
      <WhatsAppButton>WhatsApp</WhatsAppButton>
      <Button href={directionsUrl()} external variant="secondary"><Navigation className="size-5" aria-hidden="true" /> Get Directions</Button>
    </div>
  );
}

export function Contact({ heading = true }: { heading?: boolean }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-white py-16 md:py-24">
      <div className="container-x">
        {heading ? (
          <SectionHeading id="contact-title" eyebrow="Find Us" lines={["Contact Us"]} text="Visit us in Eraniel, call, or message us on WhatsApp - we're easy to reach." />
        ) : (
          <h2 id="contact-title" className="sr-only">Contact details and location</h2>
        )}
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal className="space-y-8">
            <ContactInfo />
            <ContactActions />
          </Reveal>
          <Reveal delay={0.08}><MapEmbed className="h-[22rem] sm:h-[28rem] lg:h-full lg:min-h-[28rem]" /></Reveal>
        </div>
      </div>
    </section>
  );
}

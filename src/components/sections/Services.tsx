import { ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SceneLayer } from "@/components/three/SceneLayer";
import { services } from "@/data/services";
import { appointmentUrl } from "@/lib/whatsapp";
import { Media } from "@/components/ui/Media";
import { serviceImages } from "@/data/images";

/** Service cards. Each card taps through to a WhatsApp booking pre-filled with that service. */
export function ServiceGrid({ detailed }: { detailed?: boolean }) {
  return (
    <ul className={detailed ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5"}>
      {services.map((s, i) => (
        <AnimatedCard key={s.slug} as="li" delay={(i % 5) * 0.06} className="group relative h-full overflow-hidden">
          <span aria-hidden="true" className="scan-line" />
          <Tilt3D className="h-full" max={5}>
          <a
            href={appointmentUrl({ service: s.name })} target="_blank" rel="noopener noreferrer"
            aria-label={`${s.name} - book on WhatsApp`} className="flex h-full flex-col"
          >
            {detailed && serviceImages[s.slug] && <Media src={serviceImages[s.slug].src} alt={serviceImages[s.slug].alt} zoom objectPosition="center 20%" className="aspect-[16/10]" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />}
            <span className="flex flex-1 flex-col p-5 sm:p-6">
            <span className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-mint text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white"><Icon name={s.icon} className="size-6" /></span>
              <ArrowUpRight className="size-5 text-navy-950/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-base font-bold text-navy-950">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-body">{detailed ? s.detail : s.summary}</p>
            </span>
          </a>
          </Tilt3D>
        </AnimatedCard>
      ))}
    </ul>
  );
}

export function Services() {
  return (
    <section aria-labelledby="services-title" className="cv-auto relative isolate overflow-hidden bg-white py-16 md:py-24">
      <SceneLayer scene="services" className="-z-10" />
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="services-title" eyebrow="Our Services" lines={["Advanced Healthcare", "Services"]} text="Consultation, diagnostics and pharmacy - together, so your care stays simple and coordinated." />
          <Button href="/services" variant="ghost" arrow>All services</Button>
        </div>
        <ServiceGrid />
        <div className="mt-8 sm:hidden"><WhatsAppButton className="w-full">Book on WhatsApp</WhatsAppButton></div>
      </div>
    </section>
  );
}

import { Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { hospital, telHref, urgentPhone } from "@/data/hospital";
import { SceneLayer } from "@/components/three/SceneLayer";

/** Strong but calm urgent-help block. Dials the emergency line if configured, otherwise the main hospital line. */
export function EmergencyCTA() {
  const phone = urgentPhone();
  return (
    <section aria-labelledby="emergency-title" className="on-dark bg-white py-12 md:py-16">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-950 to-navy-800 p-7 text-white sm:p-10 lg:p-14">
            <SceneLayer scene="emergency" />
            <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full bg-coral/25 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 left-1/4 size-72 rounded-full bg-brand-400/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
                  <span className="relative grid size-3 place-items-center" aria-hidden="true">
                    <span className="ping-soft absolute size-3 rounded-full bg-coral" /><span className="size-2.5 rounded-full bg-coral" />
                  </span>
                  Urgent care
                </p>
                <h2 id="emergency-title" className="mt-4 text-[clamp(1.75rem,6vw,2.75rem)] font-semibold leading-tight tracking-tight">Medical Help When You Need It</h2>
                <p className="mt-4 max-w-xl text-white/75">Call {hospital.name} straight away, or message us on WhatsApp. In a life-threatening emergency, call 108 for an ambulance.</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href={telHref(phone)} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-lg font-bold text-navy-950 shadow-[0_14px_40px_-14px_rgba(232,105,91,0.7)] transition-transform active:scale-[0.98]">
                  <Phone className="size-5 text-coral" aria-hidden="true" /> Call {phone.display}
                </a>
                <WhatsAppButton variant="outline-light" className="min-h-14 text-base">Message on WhatsApp</WhatsAppButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

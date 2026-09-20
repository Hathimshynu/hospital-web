import type { CSSProperties } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ParticleText } from "@/components/animations/ParticleText";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { HospitalIllustration } from "./HospitalIllustration";
import { HeroSceneLayer } from "./HeroSceneLayer";
import { hospital } from "@/data/hospital";

const rise = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/**
 * SERVER component: the photo, H1, copy and buttons are plain HTML that paints immediately.
 * HeroSceneLayer (3D) and ParticleText (heading effect) are progressive enhancements that
 * hydrate afterwards and never block the first paint.
 */
export function Hero({ image, alt }: { image?: string; alt: string }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-mist pt-[4.5rem]">
      {/* static backdrop: also the complete experience on low-power devices or if WebGL fails */}
      <div aria-hidden="true" className="absolute inset-0 -z-20" style={{ background: "radial-gradient(60% 50% at 80% 20%, rgba(39,196,200,0.22), transparent 70%), radial-gradient(45% 40% at 5% 95%, rgba(15,159,168,0.12), transparent 70%), linear-gradient(180deg,#eefafa 0%,#ffffff 100%)" }} />
      <div aria-hidden="true" className="absolute inset-0 -z-20 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(#0f9fa8 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(180deg, transparent, #000 30%, transparent)" }} />

      <HeroSceneLayer />

      <div className="container-x relative grid items-center gap-8 pb-10 pt-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-16 lg:pt-12">
        {/* Photo first on phones; right column on desktop */}
        <div className="relative order-1 lg:order-2 lg:col-start-2 lg:row-start-1">
          <Tilt3D max={5}>
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgba(8,35,59,0.55)] ring-1 ring-white lg:rounded-[2.25rem]">
              <Media
                src={image} alt={alt} fallback={<HospitalIllustration />} preload objectPosition="50% 62%"
                sizes="(min-width: 1024px) 52vw, 100vw" className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4]"
              />
              {/* soft base gradient only - the building stays fully visible */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy-950/35 to-transparent" />
              <div className="glass absolute bottom-3 left-3 flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-xs font-semibold text-navy-950 sm:bottom-5 sm:left-5 sm:text-sm">
                <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-white"><MapPin className="size-3.5" aria-hidden="true" /></span>
                {hospital.address.locality}, Kanyakumari
              </div>
            </div>
          </Tilt3D>
        </div>

        <div className="order-2 lg:order-1 lg:col-start-1 lg:row-start-1">
          <p className="hero-rise text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700 sm:text-xs" style={rise(0.05)}>
            Compassion • Expertise • Community Care
          </p>
          <ParticleText
            as="h1" id="hero-title" trigger="load" duration={1.4} particleCount={1000} mobileParticleCount={300}
            className="mt-4 text-[clamp(2.1rem,7.6vw,3.25rem)] font-semibold leading-[1.08] tracking-tight lg:text-[clamp(2.25rem,3.3vw,3.1rem)]"
            lines={["Expert Care.", "Compassionate People.", { text: "A Healthier You.", className: "bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent" }]}
          />
          <p className="hero-rise mt-5 max-w-xl text-base leading-relaxed text-slate-body md:text-lg" style={rise(0.15)}>
            {hospital.description}
          </p>
          <div className="hero-rise mt-7 flex flex-col gap-3 sm:flex-row" style={rise(0.25)}>
            <WhatsAppButton className="w-full sm:w-auto">Book Now on WhatsApp</WhatsAppButton>
            <Button href="/services" variant="secondary" arrow className="w-full sm:w-auto">Explore Our Services</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { ParticleText } from "@/components/animations/ParticleText";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { HospitalIllustration } from "./HospitalIllustration";
import { useDeviceTier, useWebGLSupport } from "@/hooks/useDeviceTier";
import { hospital } from "@/data/hospital";

// WebGL is split out of the main bundle and mounted only after the page is idle.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Mount the WebGL scene only once the hero has actually painted (largest-contentful-paint fired
 * and the page has loaded), plus a short settle. A 4s cap covers browsers without the LCP observer.
 * The photo and headline are therefore never competing with the 3D bundle for the main thread.
 */
function useAfterPaint(settle = 900, cap = 4000) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t = 0, po: PerformanceObserver | undefined;
    const go = (ms: number) => { window.clearTimeout(t); t = window.setTimeout(() => setReady(true), ms); };
    const afterLoad = (fn: () => void) => (document.readyState === "complete" ? fn() : window.addEventListener("load", fn, { once: true }));
    afterLoad(() => go(cap));
    try {
      po = new PerformanceObserver(() => afterLoad(() => go(settle)));
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
    return () => { window.clearTimeout(t); po?.disconnect(); };
  }, [settle, cap]);
  return ready;
}

export function Hero({ image, alt }: { image?: string; alt: string }) {
  const reduced = !!useReducedMotion();
  const tier = useDeviceTier();
  const webgl = useWebGLSupport();
  const idle = useAfterPaint();
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "150px" });
  const scroll = useRef(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => { scroll.current = v; });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 36]);

  // Copy is server-rendered visible (never opacity:0) so the H1 paints immediately; only position eases in.
  const rise = (delay: number) => ({
    initial: reduced ? false : { y: 16 },
    animate: { y: 0 },
    transition: { duration: 0.8, delay, ease },
  } as const);

  const show3d = idle && webgl && tier && tier !== "minimal";

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-mist pt-[4.5rem]">
      {/* static backdrop: also the complete experience on low-power devices or if WebGL fails */}
      <div aria-hidden="true" className="absolute inset-0 -z-20" style={{ background: "radial-gradient(60% 50% at 80% 20%, rgba(39,196,200,0.22), transparent 70%), radial-gradient(45% 40% at 5% 95%, rgba(15,159,168,0.12), transparent 70%), linear-gradient(180deg,#eefafa 0%,#ffffff 100%)" }} />
      <div aria-hidden="true" className="absolute inset-0 -z-20 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(#0f9fa8 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(180deg, transparent, #000 30%, transparent)" }} />

      {/* on phones the canvas fades out below the photo so it never sits behind the headline */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_0%,#000_34%,transparent_52%)] lg:[mask-image:none]">
        {show3d && (
          <SceneBoundary>
            <HeroScene tier={tier} reduced={reduced} active={inView} scroll={scroll} />
          </SceneBoundary>
        )}
      </div>

      <div className="container-x relative grid items-center gap-8 pb-10 pt-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-16 lg:pt-12">
        {/* Photo first on phones; right column on desktop */}
        <motion.div style={{ y: imgY }} className="relative order-1 lg:order-2">
          <Tilt3D max={5}><div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgba(8,35,59,0.55)] ring-1 ring-white lg:rounded-[2.25rem]">
            <Media
              src={image}
              alt={alt}
              fallback={<HospitalIllustration />}
              preload
              objectPosition="50% 62%"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4]"
            />
            {/* soft base gradient only - the building stays fully visible */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy-950/35 to-transparent" />
            <div className="glass absolute bottom-3 left-3 flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-xs font-semibold text-navy-950 sm:bottom-5 sm:left-5 sm:text-sm">
              <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-white"><MapPin className="size-3.5" aria-hidden="true" /></span>
              {hospital.address.locality}, Kanyakumari
            </div>
          </div></Tilt3D>
        </motion.div>

        <div className="order-2 lg:order-1">
          <motion.p {...rise(0.05)} className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700 sm:text-xs">
            Compassion • Expertise • Community Care
          </motion.p>
          <ParticleText
            as="h1" id="hero-title" trigger="load" duration={1.6} particleCount={1700} mobileParticleCount={480}
            className="mt-4 text-[clamp(2.1rem,7.6vw,3.25rem)] font-semibold leading-[1.08] tracking-tight lg:text-[clamp(2.25rem,3.3vw,3.1rem)]"
            lines={["Expert Care.", "Compassionate People.", { text: "A Healthier You.", className: "bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent" }]}
          />
          <motion.p {...rise(0.34)} className="mt-5 max-w-xl text-base leading-relaxed text-slate-body md:text-lg">
            {hospital.description}
          </motion.p>
          <motion.div {...rise(0.42)} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton className="w-full sm:w-auto">Book Now on WhatsApp</WhatsAppButton>
            <Button href="/services" variant="secondary" arrow className="w-full sm:w-auto">Explore Our Services</Button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

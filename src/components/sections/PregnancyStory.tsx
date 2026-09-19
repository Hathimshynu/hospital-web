"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SceneLayer } from "@/components/three/SceneLayer";
import { useDeviceTier, useMediaQuery, useWebGLSupport } from "@/hooks/useDeviceTier";
import { StoryFallback } from "./StoryFallback";
import { getDepartment } from "@/data/departments";
import { cn } from "@/lib/utils";
import type { StoryStage } from "@/types";

type Stage = StoryStage & { src?: string };

const OB = getDepartment("obstetrics-and-gynecology")?.name;

function Finale() {
  return (
    <div className="container-x mt-10 text-center md:mt-14">
      <p className="text-[clamp(1.5rem,5vw,2.25rem)] font-semibold tracking-tight text-navy-950">A New Life. A New Beginning.</p>
      <p className="mx-auto mt-3 max-w-md text-slate-body">Speak to our team about antenatal care and delivery.</p>
      <div className="mt-6 flex justify-center">
        <WhatsAppButton details={{ department: OB }} arrow className="w-full sm:w-auto">Book Maternity Consultation</WhatsAppButton>
      </div>
      <p className="mt-6 text-xs text-slate-body/80">Story imagery is illustrative and does not depict actual patients or hospital staff.</p>
    </div>
  );
}

/* ------------- Phones, tablets, reduced motion, no WebGL: vertical story ------------- */

function Chapter({ s, i, reduced }: { s: Stage; i: number; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Light 3D: the photo tips back into the page as it enters, sits flat mid-screen, then tips away.
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], reduced ? [0, 0, 0, 0] : [14, 0, 0, -8]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], reduced ? [1, 1, 1, 1] : [0.92, 1, 1, 0.97]);
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -18, reduced ? 0 : 18]);
  const flip = i % 2 === 1;

  return (
    <li ref={ref} className="grid items-center gap-5 md:grid-cols-2 md:gap-12">
      <div className={cn(flip && "md:order-2")} style={{ perspective: 900 }}>
        <motion.div style={{ rotateX, scale, transformStyle: "preserve-3d" }} className="will-change-transform">
          <motion.div
            className="overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-38px_rgba(8,35,59,0.55)]"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0 round 28px)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0 round 28px)" }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div style={{ y, scale: reduced ? 1 : 1.1 }}>
              <Media src={s.src} alt={s.alt} fallback={<StoryFallback stage={s} index={i} />} className="aspect-[16/10] sm:aspect-[16/9]" sizes="(min-width:768px) 45vw, 100vw" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
          <span className="text-3xl font-semibold leading-none tracking-normal text-brand-600/40">{s.n}</span>{s.kicker}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-navy-950 md:text-3xl">{s.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-body md:text-lg">{s.text}</p>
      </motion.div>
    </li>
  );
}

function StoryVertical({ stages, reduced }: { stages: Stage[]; reduced: boolean }) {
  return (
    <div className="container-x mt-12">
      <ol className="space-y-14 md:space-y-20">
        {stages.map((s, i) => <Chapter key={s.id} s={s} i={i} reduced={reduced} />)}
      </ol>
    </div>
  );
}

/* ------------------- Desktop: pinned 3D scene, HTML text beside it ------------------- */

function StoryCinematic({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const n = stages.length;
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    setActive(Math.min(n - 1, Math.round(v * (n - 1))));
  });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const sources = useMemo(() => stages.map((s) => s.src).filter((x): x is string => !!x), [stages]);

  return (
    <div ref={ref} className="relative mt-8" style={{ height: `${n * 80 + 20}dvh` }}>
      <div className="container-x sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden">
        <div className="grid flex-1 grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] items-center gap-6 py-6">
          {/* All six text blocks stay in the DOM (crawlable); the active one is shown. */}
          <div className="relative grid">
            {stages.map((s, i) => (
              <div
                key={s.id} aria-hidden={i !== active}
                className={cn("col-start-1 row-start-1 transition-all duration-700 ease-[var(--ease-premium)]", i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0")}
              >
                <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                  <span className="text-6xl font-semibold leading-none tracking-normal text-brand-600/25">{s.n}</span>{s.kicker}
                </p>
                <h3 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-navy-950 xl:text-[2.75rem]">{s.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-body">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="relative h-full min-h-[22rem]" role="img" aria-label={stages[active]?.alt}>
            <SceneLayer scene="pregnancy" progress={progress} sources={sources} className="-inset-x-6" />
          </div>
        </div>
        <div className="flex items-center gap-4 pb-6" aria-hidden="true">
          <ol className="flex gap-2">
            {stages.map((s, i) => (
              <li key={s.id} className={cn("grid size-9 place-items-center rounded-full text-xs font-bold transition-colors duration-300", i === active ? "bg-brand-600 text-white" : i < active ? "bg-brand-500/20 text-brand-700" : "bg-white text-slate-body ring-1 ring-navy-950/10")}>
                <Icon name={s.icon} className="size-4" />
              </li>
            ))}
          </ol>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-navy-950/10"><motion.div style={{ width: bar }} className="h-full rounded-full bg-brand-600" /></div>
        </div>
      </div>
    </div>
  );
}

export function PregnancyStory({ stages }: { stages: Stage[] }) {
  const reduced = !!useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const tier = useDeviceTier();
  const webgl = useWebGLSupport();
  const allImages = stages.every((s) => s.src);
  // The server render and first paint use the vertical story (crawlable, phone-first); capable desktops upgrade to the 3D scene.
  const cinematic = wide && !reduced && webgl && allImages && (tier === "high" || tier === "medium");
  return (
    <>
      {cinematic ? <StoryCinematic stages={stages} /> : <StoryVertical stages={stages} reduced={reduced} />}
      <Finale />
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SceneLayer } from "@/components/three/SceneLayer";
import { cn } from "@/lib/utils";
import type { Stage } from "./StoryVertical";

/**
 * Desktop pinned 3D story. Loaded lazily (only capable desktops ever download it). Scroll progress
 * comes from ONE rAF-throttled listener that exists only while the section is on screen; the bar
 * is written straight to the DOM and React state changes only when the active stage changes.
 */
export default function StoryCinematic({ stages }: { stages: Stage[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const n = stages.length;
  const [active, setActive] = useState(0);
  const sources = useMemo(() => stages.map((s) => s.src).filter((x): x is string => !!x), [stages]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0, listening = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const v = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      progress.current = v;
      if (bar.current) bar.current.style.width = `${v * 100}%`;
      setActive(Math.min(n - 1, Math.round(v * (n - 1))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !listening) { listening = true; window.addEventListener("scroll", onScroll, { passive: true }); update(); }
      else if (!e.isIntersecting && listening) { listening = false; window.removeEventListener("scroll", onScroll); }
    }, { rootMargin: "100px" });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [n]);

  return (
    <div ref={wrap} className="relative mt-8" style={{ height: `${n * 80 + 20}dvh` }}>
      <div className="container-x sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden">
        <div className="grid flex-1 grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] items-center gap-6 py-6">
          {/* All six text blocks stay in the DOM (crawlable); the active one is shown. */}
          <div className="relative grid">
            {stages.map((s, i) => (
              <div
                key={s.id} aria-hidden={i !== active}
                className={cn("col-start-1 row-start-1 transition-[opacity,translate] duration-700 ease-[var(--ease-premium)]", i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0")}
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
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-navy-950/10"><div ref={bar} className="h-full w-0 rounded-full bg-brand-600" /></div>
        </div>
      </div>
    </div>
  );
}

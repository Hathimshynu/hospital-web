"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useDeviceTier, useMediaQuery, useWebGLSupport } from "@/hooks/useDeviceTier";
import { useEngaged } from "@/hooks/useEngaged";

// The 3D bundle is its own chunk; it is fetched only once the visitor has engaged (see hooks/useEngaged).
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/**
 * Client-only enhancement layer behind the (server-rendered) hero. Runs the scene only while the
 * hero is on screen, and feeds it scroll progress from a single rAF-throttled listener that exists
 * only while the hero is visible.
 */
export function HeroSceneLayer() {
  const box = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const [inView, setInView] = useState(true);
  const tier = useDeviceTier();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ready = useEngaged();
  const webgl = useWebGLSupport(ready);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || !inView || reduced || !ready) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      scroll.current = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [inView, reduced, ready]);

  // unmount (and release the GL context) once the hero is off screen; it re-mounts from the cached chunk on return
  const show = ready && inView && webgl && tier && tier !== "minimal";
  return (
    <div ref={box} aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_0%,#000_34%,transparent_52%)] lg:[mask-image:none]">
      {show && (
        <SceneBoundary>
          <HeroScene tier={tier} reduced={reduced} active={inView} scroll={scroll} />
        </SceneBoundary>
      )}
    </div>
  );
}

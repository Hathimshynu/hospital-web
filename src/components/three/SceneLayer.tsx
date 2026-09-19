"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState, type MutableRefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { SceneBoundary } from "./SceneBoundary";
import { useDeviceTier, useWebGLSupport } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/utils";

// Each scene is its own chunk and is fetched only when its section approaches the viewport.
const scenes = {
  departments: dynamic(() => import("./DepartmentScene"), { ssr: false }),
  services: dynamic(() => import("./ServicesScene"), { ssr: false }),
  doctors: dynamic(() => import("./DoctorScene"), { ssr: false }),
  facilities: dynamic(() => import("./FacilitiesScene"), { ssr: false }),
  about: dynamic(() => import("./AboutScene"), { ssr: false }),
  emergency: dynamic(() => import("./EmergencyScene"), { ssr: false }),
  pregnancy: dynamic(() => import("./PregnancyScene"), { ssr: false }),
};
export type SceneName = keyof typeof scenes;

/**
 * Mounts a scene only while its container is near the viewport and unmounts it when it
 * leaves, so at most a couple of WebGL contexts are alive at once. Renders nothing on very
 * low-power devices or when WebGL fails - the section's HTML is complete on its own.
 */
export function SceneLayer({ scene, className, progress, sources }: {
  scene: SceneName; className?: string; progress?: MutableRefObject<number>; sources?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const tier = useDeviceTier();
  const webgl = useWebGLSupport();
  const reduced = !!useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Scene = scenes[scene];
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {near && webgl && tier && tier !== "minimal" && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene tier={tier} reduced={reduced} progress={progress} sources={sources} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}

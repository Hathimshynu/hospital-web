"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState, type MutableRefObject } from "react";
import { SceneBoundary } from "./SceneBoundary";
import { SceneRunContext } from "./sceneContext";
import { useDeviceTier, useMediaQuery, useWebGLSupport } from "@/hooks/useDeviceTier";
import { useEngaged } from "@/hooks/useEngaged";
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
 * Mounts a scene when its container is within ~200px of the viewport and unmounts it (disposing the
 * GL context) when it leaves. While mounted, the render loop only RUNS while the section is really on
 * screen (context -> frameloop "never" otherwise). Renders nothing on very low-power devices, without
 * WebGL, or if it fails - the section's HTML is complete on its own.
 */
export function SceneLayer({ scene, className, progress, sources }: {
  scene: SceneName; className?: string; progress?: MutableRefObject<number>; sources?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [running, setRunning] = useState(false);
  const tier = useDeviceTier();
  const webgl = useWebGLSupport();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const engaged = useEngaged();

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const mount = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "200px 0px" });
    const run = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { rootMargin: "0px" });
    mount.observe(el); run.observe(el);
    return () => { mount.disconnect(); run.disconnect(); };
  }, []);

  const Scene = scenes[scene];
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {engaged && near && webgl && tier && tier !== "minimal" && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <SceneRunContext.Provider value={running}>
              <Scene tier={tier} reduced={reduced} progress={progress} sources={sources} />
            </SceneRunContext.Provider>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}

"use client";

import type { MutableRefObject, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { DeviceTier } from "@/hooks/useDeviceTier";

export type SceneTier = Exclude<DeviceTier, "minimal">;

/** Props every lazily-loaded scene receives from <SceneLayer>. */
export interface SceneProps {
  tier: SceneTier;
  reduced: boolean;
  /** 0..1 scroll progress, for scenes driven by scroll (pregnancy) */
  progress?: MutableRefObject<number>;
  /** texture URLs, for image-based scenes (pregnancy) */
  sources?: string[];
}

/** Per-tier budget shared by all decorative scenes: phones get a light version. */
export const BUDGET: Record<SceneTier, { dpr: [number, number]; count: number; objects: number }> = {
  high: { dpr: [1, 1.5], count: 1, objects: 7 },
  medium: { dpr: [1, 1.25], count: 0.6, objects: 5 },
  low: { dpr: [1, 1], count: 0.35, objects: 3 },
};

/** Half of the visible world width at z=0 - lets scenes hug the section edges on any screen. */
export function useHalfWidth() {
  return useThree((s) => s.viewport.width) / 2;
}

/**
 * One small, isolated canvas per section. Decorative only (aria-hidden, pointer-events off):
 * all real content is HTML rendered next to it.
 */
export function SectionCanvas({ tier, reduced, children, camera = [0, 0, 9] }: {
  tier: SceneTier; reduced: boolean; children: ReactNode; camera?: [number, number, number];
}) {
  return (
    <Canvas
      dpr={BUDGET[tier].dpr}
      camera={{ position: camera, fov: 42, near: 0.1, far: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden="true"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
      {children}
    </Canvas>
  );
}

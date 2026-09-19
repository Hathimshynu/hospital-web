"use client";

import { FloatingParticles } from "./FloatingParticles";
import { BUDGET, type SceneTier } from "./SectionCanvas";

/** Shared particle layer for section scenes; density follows the device tier. */
export function MedicalParticles({ tier, reduced, base = 90, seed = 3, spread = [16, 9, 6] as [number, number, number] }: {
  tier: SceneTier; reduced: boolean; base?: number; seed?: number; spread?: [number, number, number];
}) {
  return <FloatingParticles count={Math.round(base * BUDGET[tier].count)} reduced={reduced} spread={spread} seed={seed} size={0.075} opacity={0.5} />;
}

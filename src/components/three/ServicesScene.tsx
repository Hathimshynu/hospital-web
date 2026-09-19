"use client";

import { SectionCanvas, useHalfWidth, type SceneProps } from "./SectionCanvas";
import { MedicalParticles } from "./MedicalParticles";
import { DnaHelix } from "./DnaHelix";

function Helices({ reduced, tier }: { reduced: boolean; tier: SceneProps["tier"] }) {
  const half = useHalfWidth();
  // Diagnostics feel: a slow double helix at each edge (one on phones).
  return (
    <>
      <DnaHelix position={[-half + 0.9, 0, -1]} height={6.5} radius={0.5} reduced={reduced} steps={tier === "low" ? 18 : 30} />
      {tier !== "low" && <DnaHelix position={[half - 0.9, 0.4, -1.5]} height={6} radius={0.45} reduced={reduced} steps={26} />}
    </>
  );
}

/** Services: DNA-like lines and lab-style particles. */
export default function ServicesScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <Helices reduced={reduced} tier={tier} />
      <MedicalParticles tier={tier} reduced={reduced} seed={9} base={110} />
    </SectionCanvas>
  );
}

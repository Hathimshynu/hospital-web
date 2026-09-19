"use client";

import { SectionCanvas, type SceneProps } from "./SectionCanvas";
import { MedicalParticles } from "./MedicalParticles";

/** About: a soft, slow medical particle field behind the split layout. */
export default function AboutScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <MedicalParticles tier={tier} reduced={reduced} seed={61} base={120} spread={[18, 10, 6]} />
    </SectionCanvas>
  );
}

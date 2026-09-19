"use client";

import { SectionCanvas, type SceneProps } from "./SectionCanvas";
import { MedicalParticles } from "./MedicalParticles";
import { FloatingMedicalObjects } from "./FloatingMedicalObjects";

/** Departments: soft particles plus drifting glass shapes at the edges. */
export default function DepartmentScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <MedicalParticles tier={tier} reduced={reduced} seed={4} />
      <FloatingMedicalObjects tier={tier} reduced={reduced} seed={21} />
    </SectionCanvas>
  );
}

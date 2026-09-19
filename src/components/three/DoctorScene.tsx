"use client";

import { SectionCanvas, useHalfWidth, type SceneProps } from "./SectionCanvas";
import { MedicalParticles } from "./MedicalParticles";
import { MedicalNetwork } from "./MedicalNetwork";

function Net({ tier, reduced }: SceneProps) {
  const half = useHalfWidth();
  return (
    <group position={[half * 0.72, 0, -2]}>
      <MedicalNetwork nodeCount={tier === "low" ? 28 : 52} radius={2.2} pulseCount={tier === "low" ? 3 : 6} reduced={reduced} followPointer={false} />
    </group>
  );
}

/** Doctors: a calm network sphere behind the featured doctor card. */
export default function DoctorScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <Net tier={tier} reduced={reduced} />
      <MedicalParticles tier={tier} reduced={reduced} seed={13} base={60} />
    </SectionCanvas>
  );
}

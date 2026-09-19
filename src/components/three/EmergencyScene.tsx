"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SectionCanvas, useHalfWidth, type SceneProps } from "./SectionCanvas";
import { FloatingParticles } from "./FloatingParticles";

const RINGS = 3;

/** Slow expanding pulse rings - a calm "signal" light, not an alarm. */
function Pulse({ reduced, tier }: { reduced: boolean; tier: SceneProps["tier"] }) {
  const half = useHalfWidth();
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = reduced ? 0.4 + i * 0.2 : (state.clock.elapsedTime * 0.22 + i / RINGS) % 1;
      m.scale.setScalar(0.5 + k * 4.2);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
    });
  });
  return (
    <group position={[half * 0.7, 0, -2]}>
      {Array.from({ length: tier === "low" ? 2 : RINGS }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial color="#27C4C8" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
      <mesh><circleGeometry args={[0.16, 24]} /><meshBasicMaterial color="#7DE7E8" /></mesh>
    </group>
  );
}

/** Emergency: subtle pulse of aqua light on the dark card. */
export default function EmergencyScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <Pulse reduced={reduced} tier={tier} />
      <FloatingParticles count={tier === "low" ? 24 : 60} reduced={reduced} spread={[16, 8, 4]} seed={71} size={0.07} color="#7DE7E8" opacity={0.6} />
    </SectionCanvas>
  );
}

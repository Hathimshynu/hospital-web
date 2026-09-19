"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SectionCanvas, useHalfWidth, type SceneProps } from "./SectionCanvas";
import { MedicalParticles } from "./MedicalParticles";
import { COLORS } from "./utils";

/** A wireframe block: architecture-like, but abstract - it does not depict any real facility. */
function Block({ w, h, d, x, z }: { w: number; h: number; d: number; x: number; z: number }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo} position={[x, h / 2 - 2.6, z]}>
      <lineBasicMaterial color={COLORS.teal} transparent opacity={0.45} />
    </lineSegments>
  );
}

const BLOCKS = [
  { w: 1.0, h: 2.4, d: 1.0, x: -1.8, z: 0 }, { w: 1.4, h: 1.4, d: 1.0, x: -0.4, z: 0.4 },
  { w: 0.9, h: 3.2, d: 0.9, x: 0.9, z: -0.3 }, { w: 1.2, h: 1.8, d: 1.1, x: 2.2, z: 0.2 },
];

function Skyline({ reduced, tier }: { reduced: boolean; tier: SceneProps["tier"] }) {
  const half = useHalfWidth();
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current && !reduced) g.current.rotation.y += dt * 0.07; });
  return (
    <group ref={g} position={[half * 0.62, 0, -2]} rotation={[0.12, 0.5, 0]} scale={tier === "low" ? 0.7 : 1}>
      {BLOCKS.map((b, i) => <Block key={i} {...b} />)}
    </group>
  );
}

/** Facilities: an abstract, slowly turning block skyline with soft particles. */
export default function FacilitiesScene({ tier, reduced }: SceneProps) {
  return (
    <SectionCanvas tier={tier} reduced={reduced}>
      <Skyline reduced={reduced} tier={tier} />
      <MedicalParticles tier={tier} reduced={reduced} seed={17} base={70} />
    </SectionCanvas>
  );
}

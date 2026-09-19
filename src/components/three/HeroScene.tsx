"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingParticles } from "./FloatingParticles";
import { MedicalNetwork } from "./MedicalNetwork";
import { DnaHelix } from "./DnaHelix";
import type { DeviceTier } from "@/hooks/useDeviceTier";

type ActiveTier = Exclude<DeviceTier, "minimal">;

const BUDGET: Record<ActiveTier, { nodes: number; pulses: number; particles: number; dpr: [number, number]; dna: boolean }> = {
  high: { nodes: 90, pulses: 10, particles: 160, dpr: [1, 1.75], dna: true },
  medium: { nodes: 60, pulses: 6, particles: 90, dpr: [1, 1.5], dna: false },
  low: { nodes: 38, pulses: 4, particles: 50, dpr: [1, 1.25], dna: false },
};

function Rig({ tier, reduced, scroll }: { tier: ActiveTier; reduced: boolean; scroll: MutableRefObject<number> }) {
  const viewport = useThree((s) => s.viewport);
  const stage = useRef<THREE.Group>(null);
  const wide = viewport.aspect > 1.2;
  const b = BUDGET[tier];

  useFrame((state, dt) => {
    const cam = state.camera;
    if (!reduced) {
      // subtle mouse parallax (no effect on touch devices - pointer stays centred)
      cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.5, 2.5, dt);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.3, 2.5, dt);
      // scroll response: the network drifts upward as the page scrolls
      if (stage.current) stage.current.position.y = THREE.MathUtils.damp(stage.current.position.y, scroll.current * 1.6, 3, dt);
      // camera slowly dollies closer as the hero scrolls away
      cam.position.z = THREE.MathUtils.damp(cam.position.z, 9 - scroll.current * 2.4, 3, dt);
    }
    cam.lookAt(0, 0, 0);
  });

  // Desktop: network sits behind the hospital photo on the right, peeking out around it.
  // Phones: photo is on top, so the network is centred behind it in the upper part of the section.
  const x = wide ? viewport.width * 0.22 : 0;
  const y = wide ? 0.1 : viewport.height * 0.27;
  const radius = wide ? 2.7 : 2.2;

  return (
    <>
      <group position={[x, y, 0]}>
        <group ref={stage}>
          <MedicalNetwork nodeCount={b.nodes} radius={radius} pulseCount={b.pulses} reduced={reduced} />
          {b.dna && wide && <DnaHelix position={[radius + 1.15, -0.3, -0.6]} height={4.2} reduced={reduced} />}
        </group>
      </group>
      <FloatingParticles count={b.particles} reduced={reduced} size={wide ? 0.07 : 0.09} />
    </>
  );
}

export default function HeroScene({ tier, reduced, active, scroll }: {
  tier: ActiveTier; reduced: boolean; active: boolean; scroll: MutableRefObject<number>;
}) {
  const b = BUDGET[tier];
  return (
    <Canvas
      dpr={b.dpr}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 30 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: tier === "high" ? "high-performance" : "low-power" }}
      // reduced motion: render one still frame; offscreen: stop the loop entirely
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      aria-hidden="true"
    >
      <Rig tier={tier} reduced={reduced} scroll={scroll} />
    </Canvas>
  );
}

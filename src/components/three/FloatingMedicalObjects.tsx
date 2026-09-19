"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, rng } from "./utils";
import { BUDGET, useHalfWidth, type SceneTier } from "./SectionCanvas";

type Kind = "sphere" | "ring" | "capsule" | "cross";
const KINDS: Kind[] = ["sphere", "capsule", "ring", "cross", "sphere", "capsule", "ring"];

/**
 * Abstract glass-like shapes (spheres, rings, capsules, crosses) that drift slowly at the
 * sides of a section. Deliberately generic: they are decoration, not depictions of real equipment.
 */
export function FloatingMedicalObjects({ tier, reduced, seed = 21 }: { tier: SceneTier; reduced: boolean; seed?: number }) {
  const half = useHalfWidth();
  const n = BUDGET[tier].objects;
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return { kind: KINDS[i % KINDS.length], side, ox: 0.6 + r() * 1.6, y: (r() - 0.5) * 6, z: -1 - r() * 3, s: 0.35 + r() * 0.45, spd: 0.15 + r() * 0.2, ph: r() * 6 };
    });
  }, [n, seed]);

  return (
    <group>
      {items.map((it, i) => (
        <Drift key={i} reduced={reduced} x={it.side * (half - it.ox)} y={it.y} z={it.z} speed={it.spd} phase={it.ph}>
          <group scale={it.s}>
            {it.kind === "sphere" && <mesh><sphereGeometry args={[0.7, 24, 24]} /><Glass /></mesh>}
            {it.kind === "ring" && <mesh rotation={[1.1, 0.3, 0]}><torusGeometry args={[0.7, 0.12, 16, 40]} /><Glass /></mesh>}
            {it.kind === "capsule" && <mesh rotation={[0, 0, 0.7]}><capsuleGeometry args={[0.32, 0.8, 8, 20]} /><Glass /></mesh>}
            {it.kind === "cross" && (
              <group>
                <mesh><boxGeometry args={[0.36, 1.2, 0.3]} /><Glass /></mesh>
                <mesh><boxGeometry args={[1.2, 0.36, 0.3]} /><Glass /></mesh>
              </group>
            )}
          </group>
        </Drift>
      ))}
    </group>
  );
}

function Glass() {
  return <meshStandardMaterial color={COLORS.aqua} transparent opacity={0.32} roughness={0.15} metalness={0.05} depthWrite={false} />;
}

function Drift({ children, x, y, z, speed, phase, reduced }: { children: React.ReactNode; x: number; y: number; z: number; speed: number; phase: number; reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    const o = g.current;
    if (!o || reduced) return;
    const t = state.clock.elapsedTime * speed + phase;
    o.position.set(x + Math.sin(t) * 0.15, y + Math.cos(t * 0.8) * 0.3, z);
    o.rotation.y = t * 0.6;
    o.rotation.x = Math.sin(t * 0.5) * 0.3;
  });
  return <group ref={g} position={[x, y, z]}>{children}</group>;
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeDotTexture, rng } from "./utils";

interface Props {
  count: number;
  spread?: [number, number, number];
  size?: number;
  color?: string;
  opacity?: number;
  reduced?: boolean;
  seed?: number;
}

/** Soft drifting light particles that lean slightly toward the pointer. */
export function FloatingParticles({ count, spread = [12, 7, 8], size = 0.06, color = "#0F9FA8", opacity = 0.55, reduced, seed = 3 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const r = rng(seed);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (r() - 0.5) * spread[0];
      a[i * 3 + 1] = (r() - 0.5) * spread[1];
      a[i * 3 + 2] = (r() - 0.5) * spread[2];
    }
    return a;
  }, [count, spread, seed]);

  const map = useMemo(() => makeDotTexture(), []);
  useEffect(() => () => map.dispose(), [map]);

  useFrame((state, dt) => {
    const p = ref.current;
    if (!p || reduced) return;
    p.rotation.y += dt * 0.015;
    p.position.x = THREE.MathUtils.damp(p.position.x, state.pointer.x * 0.35, 2, dt);
    p.position.y = THREE.MathUtils.damp(p.position.y, state.pointer.y * 0.25, 2, dt);
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={map} size={size} color={color} transparent opacity={opacity} depthWrite={false} sizeAttenuation />
    </points>
  );
}

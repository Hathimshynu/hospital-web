"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./utils";

/** Subtle double helix: two strands of beads joined by faint rungs. */
export function DnaHelix({ steps = 28, height = 5, radius = 0.5, turns = 2.4, reduced, position }: {
  steps?: number; height?: number; radius?: number; turns?: number; reduced?: boolean; position?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const beadsA = useRef<THREE.InstancedMesh>(null);
  const beadsB = useRef<THREE.InstancedMesh>(null);

  const { a, b, rungs } = useMemo(() => {
    const A: THREE.Vector3[] = [];
    const B: THREE.Vector3[] = [];
    for (let i = 0; i < steps; i++) {
      const u = i / (steps - 1);
      const ang = u * turns * Math.PI * 2;
      const y = (u - 0.5) * height;
      A.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius));
      B.push(new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius));
    }
    const arr = new Float32Array(steps * 6);
    A.forEach((p, i) => { p.toArray(arr, i * 6); B[i].toArray(arr, i * 6 + 3); });
    return { a: A, b: B, rungs: arr };
  }, [steps, height, radius, turns]);

  useLayoutEffect(() => {
    const d = new THREE.Object3D();
    [[beadsA.current, a], [beadsB.current, b]].forEach(([m, pts]) => {
      const mesh = m as THREE.InstancedMesh | null;
      if (!mesh) return;
      (pts as THREE.Vector3[]).forEach((p, i) => {
        d.position.copy(p);
        d.scale.setScalar(0.75 + Math.sin(i * 0.7) * 0.25);
        d.updateMatrix();
        mesh.setMatrixAt(i, d.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [a, b]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(rungs, 3));
    return g;
  }, [rungs]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, dt) => {
    if (group.current && !reduced) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group} position={position}>
      <instancedMesh ref={beadsA} args={[undefined, undefined, steps]} frustumCulled={false}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshBasicMaterial color={COLORS.aqua} />
      </instancedMesh>
      <instancedMesh ref={beadsB} args={[undefined, undefined, steps]} frustumCulled={false}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshBasicMaterial color={COLORS.deepTeal} />
      </instancedMesh>
      <lineSegments geometry={geo} frustumCulled={false}>
        <lineBasicMaterial color={COLORS.teal} transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

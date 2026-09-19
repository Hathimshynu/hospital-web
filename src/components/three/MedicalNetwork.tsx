"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, fibonacciSphere, rng } from "./utils";

interface Props {
  nodeCount: number;
  radius: number;
  pulseCount?: number;
  reduced?: boolean;
  /** extra Y rotation supplied by the parent (e.g. scroll progress) */
  extraRotation?: MutableRefObject<number>;
  followPointer?: boolean;
}

/**
 * Node graph on a soft shell. Small pulses travel along the edges like
 * signals through a care network. Everything is basic-material, so it is cheap.
 */
export function MedicalNetwork({ nodeCount, radius, pulseCount = 8, reduced, extraRotation, followPointer = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const spin = useRef(0);

  const { points, edges, linePositions } = useMemo(() => {
    const pts = fibonacciSphere(nodeCount, radius, 0.1);
    const link = radius * (2.9 / Math.sqrt(nodeCount)) * 1.35;
    const e: [number, number][] = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) if (pts[i].distanceTo(pts[j]) < link) e.push([i, j]);
    const lp = new Float32Array(e.length * 6);
    e.forEach(([a, b], k) => {
      pts[a].toArray(lp, k * 6);
      pts[b].toArray(lp, k * 6 + 3);
    });
    return { points: pts, edges: e, linePositions: lp };
  }, [nodeCount, radius]);

  const pulseState = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: pulseCount }, () => ({ edge: Math.floor(r() * edges.length), t: r(), speed: 0.25 + r() * 0.3 }));
  }, [pulseCount, edges.length]);

  const tmp = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const m = nodes.current;
    if (!m) return;
    const r = rng(5);
    points.forEach((p, i) => {
      tmp.position.copy(p);
      tmp.scale.setScalar(0.7 + r() * 1.0);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [points, tmp]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);
  useEffect(() => () => lineGeo.dispose(), [lineGeo]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.y = extraRotation?.current ?? 0;
      return;
    }
    spin.current += dt * 0.06;
    const py = followPointer ? state.pointer.x * 0.3 : 0;
    const px = followPointer ? -state.pointer.y * 0.18 : 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, spin.current + py + (extraRotation?.current ?? 0), 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, px, 3, dt);

    const pm = pulses.current;
    if (!pm || edges.length === 0) return;
    pulseState.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.edge = (p.edge * 7 + 13) % edges.length;
      }
      const [a, b] = edges[p.edge];
      tmp.position.lerpVectors(points[a], points[b], p.t);
      tmp.scale.setScalar(0.9 + Math.sin(p.t * Math.PI) * 0.5);
      tmp.updateMatrix();
      pm.setMatrixAt(i, tmp.matrix);
    });
    pm.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[radius * 0.985, 2]} />
        <meshBasicMaterial color={COLORS.aqua} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[radius, 1]} />
        <meshBasicMaterial color={COLORS.teal} wireframe transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color={COLORS.teal} transparent opacity={0.4} depthWrite={false} />
      </lineSegments>

      <instancedMesh ref={nodes} args={[undefined, undefined, points.length]} frustumCulled={false}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color={COLORS.deepTeal} />
      </instancedMesh>

      <instancedMesh ref={pulses} args={[undefined, undefined, pulseCount]} frustumCulled={false}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshBasicMaterial color={COLORS.aqua} transparent opacity={0.95} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

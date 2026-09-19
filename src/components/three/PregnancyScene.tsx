"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneProps } from "./SectionCanvas";
import { FloatingParticles } from "./FloatingParticles";
import { COLORS } from "./utils";

const ASPECT = 1698 / 926;
const W = 4.6;
const H = W / ASPECT;

/** Rounded-corner mask so the photographs are not clipped to hard rectangles (no distortion). */
function useRoundedMask() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = Math.round(512 / ASPECT);
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.beginPath(); g.roundRect(0, 0, c.width, c.height, 26); g.fill();
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function useSoftTexture(inner: string, outer: string) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, inner); r.addColorStop(1, outer);
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [inner, outer]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Loads the photographs one after another so the first stage appears immediately. */
function useTextures(sources: string[]) {
  const [tex, setTex] = useState<(THREE.Texture | undefined)[]>([]);
  const key = sources.join("|");
  useEffect(() => {
    let dead = false;
    const loader = new THREE.TextureLoader();
    const owned: THREE.Texture[] = [];
    const next = (i: number) => {
      if (dead || i >= sources.length) return;
      loader.load(sources[i], (t) => {
        if (dead) { t.dispose(); return; }
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        owned.push(t);
        setTex((prev) => { const n = [...prev]; n[i] = t; return n; });
        next(i + 1);
      }, undefined, () => next(i + 1));
    };
    next(0);
    return () => { dead = true; owned.forEach((t) => t.dispose()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return tex;
}

function Stage({ sources, progress }: { sources: string[]; progress: React.MutableRefObject<number> }) {
  const textures = useTextures(sources);
  const mask = useRoundedMask();
  const shadow = useSoftTexture("rgba(8,35,59,0.42)", "rgba(8,35,59,0)");
  const glow = useSoftTexture("rgba(39,196,200,0.55)", "rgba(39,196,200,0)");
  const n = sources.length;
  const t = useRef(0);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, dt) => {
    const target = progress.current * (n - 1);
    t.current = THREE.MathUtils.damp(t.current, target, 3.2, dt);
    for (let i = 0; i < n; i++) {
      const g = groups.current[i], m = mats.current[i];
      if (!g || !m) continue;
      const d = i - t.current;      // >0 waiting on the right, <0 already passed
      const a = Math.abs(d);
      // Upcoming photos slide in from the right; finished ones recede backwards (and fade) instead of sliding into the text.
      const passed = d < 0;
      g.position.set(passed ? d * 1.5 : d * 3.6, Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.04 + (passed ? a * 0.25 : 0), -a * 2.4);
      g.rotation.y = -d * (passed ? 0.2 : 0.34);
      g.rotation.x = d * 0.03;
      g.scale.setScalar(1 - Math.min(a, 2) * 0.07);
      const fade = passed ? 1 - Math.max(0, a - 0.15) * 1.25 : 1 - Math.max(0, a - 0.6) * 1.3;
      const o = THREE.MathUtils.clamp(fade, 0, 1) * (textures[i] ? 1 : 0);
      m.opacity = o; g.visible = o > 0.01;
    }
    if (glowMat.current) glowMat.current.opacity = 0.5;
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.5, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.3 + Math.sin(t.current * 1.1) * 0.06, 2.5, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 8.9 - progress.current * 1.0, 2.5, dt);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <mesh position={[0, 0, -0.6]} scale={[W * 1.5, H * 1.6, 1]}><planeGeometry /><meshBasicMaterial ref={glowMat} map={glow} transparent depthWrite={false} /></mesh>
      {sources.map((_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          {/* soft contact shadow below the photograph */}
          <mesh position={[0, -H * 0.62, -0.2]} rotation={[-0.2, 0, 0]} scale={[W * 0.95, H * 0.22, 1]}>
            <planeGeometry /><meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.7} />
          </mesh>
          <mesh>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial ref={(el) => { mats.current[i] = el; }} map={textures[i] ?? null} alphaMap={mask} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/**
 * Six photographs mapped onto planes in 3D. Scroll progress drives depth, side-to-side entry,
 * a slight yaw and fade. All headings and copy live in HTML next to this canvas.
 */
export default function PregnancyScene({ tier, reduced, progress, sources }: SceneProps) {
  if (!progress || !sources?.length) return null;
  return (
    <Canvas
      dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 8.6], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden="true"
    >
      <Stage sources={sources} progress={progress} />
      <FloatingParticles count={tier === "high" ? 90 : 50} reduced={reduced} spread={[14, 7, 5]} seed={51} size={0.08} color={COLORS.teal} opacity={0.5} />
    </Canvas>
  );
}

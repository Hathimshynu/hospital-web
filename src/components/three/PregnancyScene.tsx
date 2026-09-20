"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneProps, SceneTier } from "./SectionCanvas";
import { useSceneRunning } from "./sceneContext";
import { FloatingParticles } from "./FloatingParticles";
import { COLORS } from "./utils";

const ASPECT = 1600 / 872;
const W = 4.6;
const H = W / ASPECT;

/** How many stages AHEAD of the visitor are fetched: desktops prefetch two, everything else one. */
const LOOKAHEAD: Record<SceneTier, number> = { high: 2, medium: 1, low: 1 };

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

/**
 * Proximity-based photo loader, deliberately NOT React state:
 *  - one shared TextureLoader and one ref-held array (no per-stage state machines, no re-renders)
 *  - stage 0 is requested on mount; stage N + lookahead is requested from inside the existing render
 *    loop as the visitor approaches, so far-away stages are never fetched
 *  - each texture is written to its OWN slot/material, so a late arrival can never replace a newer stage
 *  - `readyThrough()` is the last stage whose predecessors are all loaded; the scene never scrolls past it,
 *    so a stage can never appear blank - it simply waits on the previous photo for a moment
 */
function usePhotoLoader(sources: string[]) {
  const key = sources.join("|");
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const textures: (THREE.Texture | undefined)[] = [];
    const requested = new Set<number>();
    const listeners: ((i: number, t: THREE.Texture) => void)[] = [];
    const flags = { dead: false };

    const ensure = (i: number) => {
      if (flags.dead || i < 0 || i >= sources.length || requested.has(i)) return;
      requested.add(i);
      loader.load(
        sources[i],
        (t) => {
          if (flags.dead) { t.dispose(); return; }
          t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
          textures[i] = t;
          listeners.forEach((l) => l(i, t));
        },
        undefined,
        () => requested.delete(i), // allow a retry on the next approach
      );
    };
    const readyThrough = () => { let k = -1; while (textures[k + 1]) k++; return k; };
    const start = () => { flags.dead = false; };
    const dispose = () => { flags.dead = true; textures.forEach((t) => t?.dispose()); textures.length = 0; requested.clear(); listeners.length = 0; };
    return { start, ensure, readyThrough, textures, onLoad: (l: (i: number, t: THREE.Texture) => void) => { listeners.push(l); }, dispose };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

function Stage({ sources, progress, tier, onReady }: { sources: string[]; progress: React.MutableRefObject<number>; tier: SceneTier; onReady?: () => void }) {
  const announced = useRef(false);
  const photos = usePhotoLoader(sources);
  const mask = useRoundedMask();
  const shadow = useSoftTexture("rgba(8,35,59,0.42)", "rgba(8,35,59,0)");
  const glow = useSoftTexture("rgba(39,196,200,0.55)", "rgba(39,196,200,0)");
  const n = sources.length;
  const t = useRef(0);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useEffect(() => {
    // attach each photo to its own material the moment it arrives (no React state involved)
    photos.start(); // restartable, so React Strict Mode's effect re-run cannot leave a dead loader
    photos.onLoad((i, tex) => { const m = mats.current[i]; if (m) { m.map = tex; m.needsUpdate = true; } });
    photos.ensure(0);
    return () => photos.dispose();
  }, [photos]);

  useFrame((state, dt) => {
    const want = progress.current * (n - 1);
    // request the stages the visitor is about to reach (Set-guarded, so this is a few integer checks per frame)
    for (let j = Math.floor(want); j <= Math.min(n - 1, Math.floor(want) + LOOKAHEAD[tier]); j++) photos.ensure(j);
    // never travel past the last contiguously-loaded stage: no blank stage, no flicker
    const target = Math.min(want, Math.max(0, photos.readyThrough()));
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
      const o = THREE.MathUtils.clamp(fade, 0, 1) * (m.map ? 1 : 0);
      m.opacity = o; g.visible = o > 0.01;
    }
    if (!announced.current && photos.readyThrough() >= 0) { announced.current = true; onReady?.(); }
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.5, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.3 + Math.sin(t.current * 1.1) * 0.06, 2.5, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 8.9 - progress.current * 1.0, 2.5, dt);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <mesh position={[0, 0, -0.6]} scale={[W * 1.5, H * 1.6, 1]}><planeGeometry /><meshBasicMaterial map={glow} transparent opacity={0.5} depthWrite={false} /></mesh>
      {sources.map((_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          {/* soft contact shadow below the photograph */}
          <mesh position={[0, -H * 0.62, -0.2]} rotation={[-0.2, 0, 0]} scale={[W * 0.95, H * 0.22, 1]}>
            <planeGeometry /><meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.7} />
          </mesh>
          <mesh>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial ref={(el) => { mats.current[i] = el; }} alphaMap={mask} transparent opacity={0} toneMapped={false} depthWrite={false} />
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
export default function PregnancyScene({ tier, reduced, progress, sources, onReady }: SceneProps) {
  const running = useSceneRunning();
  if (!progress || !sources?.length) return null;
  return (
    <Canvas
      dpr={tier === "high" ? [1, 1.5] : [1, 1.25]}
      camera={{ position: [0, 0, 8.6], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : running ? "always" : "never"}
      aria-hidden="true"
    >
      <Stage sources={sources} progress={progress} tier={tier} onReady={onReady} />
      <FloatingParticles count={tier === "high" ? 90 : 50} reduced={reduced} spread={[14, 7, 5]} seed={51} size={0.08} color={COLORS.teal} opacity={0.5} />
    </Canvas>
  );
}

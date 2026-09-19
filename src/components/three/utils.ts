import * as THREE from "three";

/** Deterministic PRNG (mulberry32) so scene layout is pure and stable. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Evenly distributed points on a sphere surface. */
export function fibonacciSphere(n: number, radius: number, jitter = 0, seed = 7): THREE.Vector3[] {
  const rand = rng(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const k = radius * (1 + (rand() - 0.5) * jitter);
    return new THREE.Vector3(Math.cos(th) * r * k, y * k, Math.sin(th) * r * k);
  });
}

/** Soft round sprite used for particle points. */
export function makeDotTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Palette for a bright scene: normal blending, mid-tone teals that read on white. */
export const COLORS = {
  navy: "#08233B",
  teal: "#0F9FA8",
  deepTeal: "#0B7F88",
  aqua: "#27C4C8",
  mist: "#8FE3E5",
};

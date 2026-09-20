"use client";

import { useSyncExternalStore } from "react";

/**
 * minimal: no WebGL at all (static fallback) · low: phones · medium: tablets /
 * modest hardware · high: desktops.
 */
export type DeviceTier = "minimal" | "low" | "medium" | "high";

function detect(): DeviceTier {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const w = window.innerWidth;
  if (nav.connection?.saveData === true || mem <= 1 || cores <= 2) return "minimal";
  if (w < 768) return "low";
  if (w < 1024 || mem <= 4 || cores <= 4) return "medium";
  return "high";
}

const subscribe = (cb: () => void) => {
  const queries = [window.matchMedia("(max-width: 767px)"), window.matchMedia("(max-width: 1023px)")];
  queries.forEach((q) => q.addEventListener("change", cb));
  return () => queries.forEach((q) => q.removeEventListener("change", cb));
};

/** `null` during SSR/hydration so the WebGL canvas only ever mounts client-side. */
export function useDeviceTier(): DeviceTier | null {
  return useSyncExternalStore(subscribe, detect, () => null);
}

/** Live media-query match (false on the server). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const q = window.matchMedia(query);
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let webglCache: boolean | null = null;
function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    webglCache = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // release the probe context immediately
  } catch {
    webglCache = false;
  }
  return webglCache;
}
/**
 * True when the browser can actually create a WebGL context. The probe creates (and immediately releases)
 * a context, so it runs ONLY when `enabled` - callers pass "the visitor has engaged", which keeps
 * first load free of any WebGL context.
 */
export function useWebGLSupport(enabled = true): boolean {
  return useSyncExternalStore(() => () => {}, () => (enabled ? detectWebGL() : false), () => false);
}

/** Cheap presence check (no context is created): does this browser expose WebGL at all? */
export function useWebGLApi(): boolean {
  return useSyncExternalStore(() => () => {}, () => typeof window !== "undefined" && "WebGLRenderingContext" in window, () => false);
}

/** True only for a real mouse (hover + fine pointer). Phones, tablets and touch laptops in touch mode are false. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

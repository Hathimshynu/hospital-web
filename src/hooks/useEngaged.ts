"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared "the visitor is actually here" signal. It flips to true on the first interaction (mouse
 * move, pointer down, scroll, touch, key) after the page has loaded, or after an 8s idle fallback for
 * someone who only looks at the page. Every WebGL scene waits for it, so the ~900 KB 3D engine is never
 * downloaded or parsed during the first seconds while the photo and headline are painting.
 */
const EVENTS = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
const IDLE_FALLBACK_MS = 8000;

let engaged = false;
let armed = false;
const listeners = new Set<() => void>();

function fire() {
  if (engaged) return;
  engaged = true;
  EVENTS.forEach((e) => window.removeEventListener(e, fire));
  listeners.forEach((l) => l());
}

function arm() {
  if (armed || typeof window === "undefined") return;
  armed = true;
  const start = () => {
    EVENTS.forEach((e) => window.addEventListener(e, fire, { passive: true }));
    window.setTimeout(fire, IDLE_FALLBACK_MS);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

const subscribe = (cb: () => void) => {
  arm();
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};

export function useEngaged(): boolean {
  return useSyncExternalStore(subscribe, () => engaged, () => false);
}

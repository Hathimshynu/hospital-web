"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/useDeviceTier";

const LINK = "a, button, [role=button], summary, label[for]";
const TRAIL = 5;

/**
 * Desktop-only glow cursor: dot + soft ring + glow + a short fading trail.
 * Everything is driven by refs and one requestAnimationFrame loop that only writes
 * `transform` - React never re-renders on mouse move. The native cursor stays for text fields
 * and the map, and keyboard focus styles are untouched.
 */
export function GlowCursor() {
  const fine = useFinePointer();
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const trail = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!fine) return;
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-glow-cursor");

    let mx = -100, my = -100, rx = -100, ry = -100, gx = -100, gy = -100;
    const tr = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
    let raf = 0, visible = false, running = false;

    const setMode = (m: string) => { el.dataset.mode = m; };

    const tick = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      gx += (mx - gx) * 0.09; gy += (my - gy) * 0.09;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      if (glow.current) glow.current.style.transform = `translate3d(${gx}px,${gy}px,0) translate(-50%,-50%)`;
      let px = gx, py = gy;
      for (let i = 0; i < TRAIL; i++) {
        const t = tr[i];
        t.x += (px - t.x) * 0.32; t.y += (py - t.y) * 0.32;
        const n = trail.current[i];
        if (n && !reduced) n.style.transform = `translate3d(${t.x}px,${t.y}px,0) translate(-50%,-50%) scale(${1 - i * 0.14})`;
        px = t.x; py = t.y;
      }
      const settled = Math.abs(mx - rx) + Math.abs(my - ry) + Math.abs(mx - gx) + Math.abs(my - gy) + Math.abs(mx - tr[TRAIL - 1].x) < 0.6;
      if (settled) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (!visible) {
        visible = true; rx = gx = mx; ry = gy = my;
        tr.forEach((t) => { t.x = mx; t.y = my; });
        el.style.opacity = "1";
      }
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      if (t.closest("iframe, input, textarea, select")) setMode("native");
      else if (t.closest(LINK)) setMode("link");
      else if (t.closest("[data-cursor=card]")) setMode("card");
      else if (t.closest("[data-cursor=image], img")) setMode("image");
      else setMode("idle");
    };
    const down = () => { el.dataset.press = "1"; };
    const up = () => { delete el.dataset.press; };
    const leave = () => { visible = false; el.style.opacity = "0"; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-glow-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine]);

  if (!fine) return null;
  return (
    <div ref={root} aria-hidden="true" data-mode="idle" className="glow-cursor pointer-events-none fixed inset-0 z-[300]" style={{ opacity: 0 }}>
      <div ref={glow} className="gc-glow" />
      {Array.from({ length: TRAIL }, (_, i) => (
        <div key={i} ref={(n) => { trail.current[i] = n; }} className="gc-trail" style={{ opacity: 0.22 - i * 0.035 }} />
      ))}
      <div ref={ring} className="gc-ring" />
      <div ref={dot} className="gc-dot" />
    </div>
  );
}

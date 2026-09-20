"use client";

import { createElement, useEffect, useRef, useState, type ElementType } from "react";
import { useDeviceTier, useMediaQuery } from "@/hooks/useDeviceTier";
import { cn } from "@/lib/utils";

/**
 * React Bits-style particle text, implemented in plain canvas 2D (no extra dependency).
 *
 * The heading is REAL HTML and always present: crawlers, screen readers and no-JS visitors get
 * the text as normal. When the effect runs, the text is briefly made transparent while a decorative
 * (aria-hidden) canvas gathers particles into the letter shapes, then the real text fades in and the
 * canvas fades out. Reduced motion, very low-power devices, unsupported canvas and resize all skip
 * straight to the plain text.
 */
export interface ParticleLine { text: string; className?: string }

interface Props {
  /** heading lines; each is rendered as a block so the sampled shapes match the layout */
  lines?: (string | ParticleLine)[];
  /** convenience: a single line of text */
  text?: string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** final text colour (CSS colour); gradient lines can set their own className */
  color?: string;
  /** particle palette (teal / aqua / soft cyan, occasionally navy or white) */
  particleColor?: string[];
  particleCount?: number;
  mobileParticleCount?: number;
  /** seconds for particles to converge */
  duration?: number;
  /** "load": start when hydrated; "view": start when scrolled into view */
  trigger?: "load" | "view";
  /** particle radius in CSS px */
  size?: number;
  align?: "left" | "center";
}

const PALETTE = ["#0F9FA8", "#27C4C8", "#7DE7E8", "#0F9FA8", "#27C4C8", "#08233B", "#FFFFFF"];

const norm = (l: string | ParticleLine): ParticleLine => (typeof l === "string" ? { text: l } : l);

export function ParticleText({
  lines, text, as = "h2", id, className, color = "#08233B", particleColor = PALETTE,
  particleCount = 1000, mobileParticleCount = 300, duration = 1.5, trigger = "view", size = 1.5, align = "left",
}: Props) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tier = useDeviceTier();
  const [phase, setPhase] = useState<"idle" | "forming" | "done">("idle");
  const started = useRef(false);
  const items = (lines ?? (text ? [text] : [])).map(norm);

  const enabled = !reduced && tier !== null && tier !== "minimal";
  const count = tier === "high" ? particleCount : tier === "medium" ? Math.round(particleCount * 0.55) : mobileParticleCount;

  // start trigger
  useEffect(() => {
    const el = host;
    if (!enabled || !el || started.current) return;
    const begin = () => { if (!started.current) { started.current = true; setPhase("forming"); } };
    if (trigger === "load") {
      // Never compete with first paint: start once the page has loaded and the browser is idle.
      // The real heading is already on screen, so nothing is waiting on this.
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
      let idleId = 0, tid = 0;
      const kick = () => { if (w.requestIdleCallback) idleId = w.requestIdleCallback(begin, { timeout: 1500 }); else tid = window.setTimeout(begin, 300); };
      if (document.readyState === "complete") kick(); else window.addEventListener("load", kick, { once: true });
      return () => { window.removeEventListener("load", kick); w.cancelIdleCallback?.(idleId); window.clearTimeout(tid); };
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { begin(); io.disconnect(); } }, { rootMargin: "-10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, trigger, host]);

  // the effect
  useEffect(() => {
    if (phase !== "forming") return;
    const el = host, cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) { setPhase("done"); return; }
    let raf = 0, dead = false;
    const finish = () => { if (!dead) setPhase("done"); };
    // no point animating a heading nobody can see: end the effect (text is already solid HTML) when it scrolls away
    const leaveIo = new IntersectionObserver(([e]) => { if (!e.isIntersecting) { dead = true; cancelAnimationFrame(raf); setPhase("done"); } });
    leaveIo.observe(el);
    const onResize = () => { dead = true; cancelAnimationFrame(raf); setPhase("done"); };

    const run = async () => {
      try { await document.fonts?.ready; } catch {}
      if (dead) return;
      const box = el.getBoundingClientRect();
      const pad = 40;
      const W = Math.ceil(box.width + pad * 2), H = Math.ceil(box.height + pad * 2);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;

      // 1. draw the heading's lines into an offscreen canvas, at the exact on-screen positions
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.fillStyle = "#000"; o.textBaseline = "alphabetic";
      el.querySelectorAll<HTMLElement>("[data-pt-line]").forEach((ln) => {
        const cs = getComputedStyle(ln);
        const r = document.createRange(); r.selectNodeContents(ln);
        const rr = r.getBoundingClientRect();
        o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        (o as unknown as { letterSpacing: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        const m = o.measureText(ln.textContent ?? "");
        const asc = m.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.9;
        const desc = m.fontBoundingBoxDescent ?? parseFloat(cs.fontSize) * 0.25;
        const baseline = rr.top - box.top + pad + (rr.height - (asc + desc)) / 2 + asc;
        o.fillText(ln.textContent ?? "", rr.left - box.left + pad, baseline);
      });

      // 2. sample opaque pixels into target points
      const data = o.getImageData(0, 0, W, H).data;
      const pts: [number, number][] = [];
      const step = Math.max(2, Math.round(Math.sqrt((W * H * 0.06) / count)));
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
      if (pts.length < 20) { finish(); return; }

      // 3. particles start scattered and converge with staggered easing
      const cx = W / 2, cy = H / 2;
      const ps = pts.map(([tx, ty]) => {
        const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * Math.max(W, H) * 0.35;
        const dist = Math.hypot(tx - cx, ty - cy) / Math.hypot(cx, cy);
        const c = particleColor[Math.floor(Math.pow(dist, 0.8) * 0.9 * particleColor.length + Math.random() * 1.6) % particleColor.length];
        return { x: tx + Math.cos(a) * d, y: ty + Math.sin(a) * d * 0.7, tx, ty, sx: 0, sy: 0, delay: Math.random() * 0.35, c, r: size * (0.6 + Math.random() * 0.8) };
      });
      ps.forEach((p) => { p.sx = p.x; p.sy = p.y; });

      const total = duration * 1000 + 350;
      const t0 = performance.now();
      const frame = (now: number) => {
        if (dead) return;
        const t = now - t0;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        for (const p of ps) {
          const k = Math.min(1, Math.max(0, (t / 1000 - p.delay) / duration));
          const e = 1 - Math.pow(1 - k, 3);
          const wob = (1 - e) * 4 + 0.35;
          const x = p.sx + (p.tx - p.sx) * e + Math.sin(t / 240 + p.tx) * wob * 0.25;
          const y = p.sy + (p.ty - p.sy) * e + Math.cos(t / 260 + p.ty) * wob * 0.25;
          ctx.globalAlpha = 0.35 + 0.65 * e;
          ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.2832); ctx.fill();
        }
        if (t < total) raf = requestAnimationFrame(frame); else finish();
      };
      raf = requestAnimationFrame(frame);
    };
    run();
    window.addEventListener("resize", onResize, { once: true });
    return () => { dead = true; leaveIo.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- palette identity is irrelevant; only its contents matter
  }, [phase, count, duration, size, particleColor.join(), host]);

  const forming = phase === "forming";
  const Tag = as as ElementType;
  return createElement(
    Tag,
    { ref: setHost, id, className: cn("relative", align === "center" && "text-center", className), style: { color } },
    <>
      {items.map((l, i) => (
        <span
          key={i} data-pt-line
          className={cn("block transition-[opacity,color] duration-500", l.className)}
          style={forming ? { opacity: 0.14, transition: "none" } : undefined}
        >
          {l.text}
        </span>
      ))}
      {/* decorative layer: never read by assistive tech or crawlers */}
      {phase !== "idle" && (
        <canvas
          ref={canvas} aria-hidden="true"
          className={cn("pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500", forming ? "opacity-100" : "opacity-0")}
        />
      )}
    </>,
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/hooks/useDeviceTier";

// The cursor is a separate, lazily loaded chunk and only exists for real mice.
const GlowCursor = dynamic(() => import("./GlowCursor").then((m) => m.GlowCursor), { ssr: false });

const REVEAL = "[data-reveal],[data-reveal-group],[data-reveal-clip]";

/**
 * The ONLY global client behaviour for scrolling / hover, replacing per-element animation JS:
 *  1. one IntersectionObserver reveals [data-reveal*] elements (adds .is-visible)
 *  2. one IntersectionObserver on a sentinel marks html[data-scrolled] for the header
 *  3. one delegated, rAF-throttled pointer handler tilts [data-tilt] cards (mouse only)
 * No scroll listeners, no React state per element.
 */
export function GlobalEffects() {
  const fine = useFinePointer();
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // 0. enable page transitions from the first click on (the initial load never animates)
    const armNav = () => root.setAttribute("data-nav", "1");
    document.addEventListener("click", armNav, { capture: true, once: true });
    window.addEventListener("popstate", armNav, { once: true });

    // 1. reveal
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add("is-visible");
        io.unobserve(el);
        // once shown, drop the reveal styling so normal hover transitions take over
        if (el.hasAttribute("data-reveal")) window.setTimeout(() => el.removeAttribute("data-reveal"), 1800);
      }
    }, { rootMargin: "0px 0px -6% 0px" });
    const scan = () => document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
      if (!seen.has(el) && !el.classList.contains("is-visible")) { seen.add(el); io.observe(el); }
    });
    scan();
    let scanRaf = 0;
    const mo = new MutationObserver(() => { if (!scanRaf) scanRaf = requestAnimationFrame(() => { scanRaf = 0; scan(); }); });
    mo.observe(document.body, { childList: true, subtree: true });

    // 2. header state
    const sentinel = document.getElementById("top-sentinel");
    const so = sentinel ? new IntersectionObserver(([e]) => root.toggleAttribute("data-scrolled", !e.isIntersecting)) : null;
    if (sentinel) so?.observe(sentinel);

    // 3. tilt
    let tiltCleanup = () => {};
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let cur: HTMLElement | null = null, ev: PointerEvent | null = null, raf = 0;
      const reset = (el: HTMLElement | null) => { el?.style.removeProperty("--rx"); el?.style.removeProperty("--ry"); };
      const apply = () => {
        raf = 0;
        if (!cur || !ev) return;
        const r = cur.getBoundingClientRect();
        const max = Number(cur.dataset.tilt) || 6;
        cur.style.setProperty("--ry", `${((ev.clientX - r.left) / r.width - 0.5) * max * 2}deg`);
        cur.style.setProperty("--rx", `${-((ev.clientY - r.top) / r.height - 0.5) * max * 2}deg`);
      };
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const t = (e.target as Element | null)?.closest?.("[data-tilt]") as HTMLElement | null;
        if (t !== cur) { reset(cur); cur = t; }
        ev = e;
        if (cur && !raf) raf = requestAnimationFrame(apply);
      };
      const leave = () => { reset(cur); cur = null; };
      document.addEventListener("pointermove", move, { passive: true });
      root.addEventListener("pointerleave", leave);
      tiltCleanup = () => { document.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
    }

    return () => { document.removeEventListener("click", armNav, true); window.removeEventListener("popstate", armNav); io.disconnect(); mo.disconnect(); so?.disconnect(); cancelAnimationFrame(scanRaf); tiltCleanup(); };
  }, []);

  // load the cursor chunk only for mouse users, after the page is idle
  useEffect(() => {
    if (!fine) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) { const id = w.requestIdleCallback(() => setCursor(true), { timeout: 3000 }); return () => w.cancelIdleCallback?.(id); }
    const t = window.setTimeout(() => setCursor(true), 1500);
    return () => window.clearTimeout(t);
  }, [fine]);

  return cursor ? <GlowCursor /> : null;
}

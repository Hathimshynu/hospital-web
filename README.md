# Hospital website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · React Three Fiber · Framer Motion.

## Run

```bash
npm install
npm run dev                              # http://localhost:3000
npm run dev -- --hostname 0.0.0.0        # reachable from a phone on the same Wi-Fi: http://<your-LAN-IP>:3000
npm run build && npm start               # production
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real domain before deploying
(canonical URLs, sitemap, Open Graph and structured data all read it).

## Where to change things

| What | Where |
|------|-------|
| Hospital name, tagline, address, phone numbers, WhatsApp, emergency line, email, hours, social, SEO defaults | `src/data/hospital.ts` (single source of truth) |
| Departments (set `listed: true` to show one) | `src/data/departments.ts` |
| Doctors | `src/data/doctors.ts` |
| Services / facilities / story stages / blog | `src/data/*.ts` |
| WhatsApp number + message format | `src/data/hospital.ts` + `src/lib/whatsapp.ts` |
| Photographs | `public/images/` - see `public/images/README.md` for exact filenames |

Optional values that are `null` in `hospital.ts` (`emergency`, `email`, `hours`, `coordinates`) are hidden automatically until filled in.

## Performance architecture (keep this when editing)

- **Server components by default.** Sections, cards, `Reveal`, `AnimatedCard`, `TextReveal`, `ImageReveal`, `Tilt3D`, the navbar shell and the hero are server components. Motion is CSS.
- **One global client helper** (`components/layout/GlobalEffects.tsx`): a single IntersectionObserver adds `.is-visible` to `[data-reveal*]` elements, another marks `html[data-scrolled]` for the header, and one delegated handler tilts `[data-tilt]` cards for real mice. `html.js` is set by an inline script, so **without JavaScript nothing is hidden**.
- **3D is progressive.** No WebGL is downloaded until the visitor first interacts (`hooks/useEngaged.ts`, 8 s idle fallback). Each scene is its own lazy chunk (`components/three/SceneLayer.tsx`), mounts near the viewport, and its render loop only runs while on screen. Tiers: high / medium / low / static (reduced motion, no WebGL, very low power).
- **Particle headings** (`components/animations/ParticleText.tsx`) enhance a real HTML heading; the text stays visible (dimmed, never empty) and reduced-motion users get the plain heading.
- **Images** live in `public/images/optimized/` (real WebP) and are referenced only from `src/data/images.ts`. Your originals in `public/images/` are never served.
- **Framer Motion has been removed.**

Commands: `npm run build` then `npm start` (or `npm start -- -H 0.0.0.0 -p 3477` for phone testing on the same Wi-Fi). If Turbopack runs out of memory on a low-RAM machine, use `npx next build --webpack`.

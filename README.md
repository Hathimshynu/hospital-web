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

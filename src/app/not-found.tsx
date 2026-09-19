import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

const links = [
  { label: "Home", href: "/" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="bg-gradient-to-b from-mint to-white pb-20 pt-36 md:pt-44">
      <div className="container-x max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Error 404</p>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-tight tracking-tight text-navy-950">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-slate-body">It may have moved, or the link may be incorrect. Try one of these instead:</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-navy-950/15 bg-white px-5 font-semibold text-navy-950 hover:border-brand-500 hover:text-brand-700">{l.label}</Link></li>)}
        </ul>
        <div className="mt-8 flex justify-center"><Button href="/appointments" arrow>Book an appointment</Button></div>
      </div>
    </section>
  );
}

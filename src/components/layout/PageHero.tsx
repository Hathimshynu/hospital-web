import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";

/**
 * Inner-page header. Renders the page's single H1, a visible breadcrumb and
 * the matching BreadcrumbList structured data. `crumbs` excludes Home; the last
 * crumb is the current page.
 */
export function PageHero({ eyebrow, title, text, crumbs = [], path = "/", children }: {
  eyebrow: string;
  title: string;
  text?: string;
  crumbs?: { label: string; href?: string }[];
  /** URL path of this page (used for the last breadcrumb item) */
  path?: string;
  children?: ReactNode;
}) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs.map((c, i) => ({ label: c.label, href: c.href ?? (i === crumbs.length - 1 ? path : undefined) }))];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mint to-white pb-12 pt-32 md:pb-16 md:pt-40">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full bg-brand-400/20 blur-3xl" />
      {crumbs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(trail)) }} />}
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-body">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="inline-flex min-h-11 items-center hover:text-brand-700">Home</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                {c.href && i < crumbs.length - 1 ? <Link href={c.href} className="inline-flex min-h-11 items-center hover:text-brand-700">{c.label}</Link> : <span aria-current="page" className="font-semibold text-navy-950">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p></Reveal>
        <Reveal delay={0.06}><h1 className="max-w-3xl text-[clamp(2rem,7vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-navy-950">{title}</h1></Reveal>
        {text && <Reveal delay={0.12}><p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-body md:text-lg">{text}</p></Reveal>}
        {children && <Reveal delay={0.18}><div className="mt-7 flex flex-wrap gap-3">{children}</div></Reveal>}
      </div>
    </section>
  );
}

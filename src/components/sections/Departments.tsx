import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { resolveImage } from "@/lib/assets";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SceneLayer } from "@/components/three/SceneLayer";
import { listedDepartments } from "@/data/departments";
import type { Department } from "@/types";

export function DepartmentCard({ d, delay = 0 }: { d: Department; delay?: number }) {
  return (
    <AnimatedCard as="li" delay={delay} className="group relative h-full overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-400/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-400/25" />
      <Tilt3D className="h-full" max={5}>
      <Link href={`/departments/${d.slug}`} className="flex h-full flex-col">
        <Media src={d.image ? resolveImage(d.image) : undefined} alt={`${d.name} consultation at the hospital`} icon={d.icon} zoom className="aspect-[16/9]" sizes="(min-width:768px) 50vw, 100vw" />
        <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="grid size-14 place-items-center rounded-2xl bg-mint text-brand-600 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white"><Icon name={d.icon} className="size-7" /></span>
        <h3 className="mt-5 text-xl font-bold text-navy-950">{d.name}</h3>
        <p className="mt-2 text-slate-body">{d.summary}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {d.careAreas.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-navy-950"><Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />{c}</li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
          Learn more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
        </span>
        </div>
      </Link>
      </Tilt3D>
    </AnimatedCard>
  );
}

export function DepartmentGrid() {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {listedDepartments.map((d, i) => <DepartmentCard key={d.slug} d={d} delay={i * 0.08} />)}
    </ul>
  );
}

export function Departments() {
  return (
    <section aria-labelledby="dept-title" className="relative isolate overflow-hidden bg-mist py-16 md:py-24">
      <SceneLayer scene="departments" className="-z-10" />
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="dept-title" particles eyebrow="Departments" lines={["Comprehensive Care", "Under One Roof"]} text="Specialist teams and on-site diagnostics working together for you and your family." />
          <Button href="/departments" variant="ghost" arrow>All departments</Button>
        </div>
        <DepartmentGrid />
      </div>
    </section>
  );
}

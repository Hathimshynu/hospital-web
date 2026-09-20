import { Media } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Button } from "@/components/ui/Button";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SceneLayer } from "@/components/three/SceneLayer";
import { resolveImage } from "@/lib/assets";
import { facilities } from "@/data/facilities";

export function FacilityGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {facilities.map((f, i) => (
        <AnimatedCard key={f.slug} as="li" delay={i * 0.06} className="group overflow-hidden">
          <Tilt3D className="h-full" max={4}>
          <Media src={resolveImage(f.imageKey)} alt={`${f.name} at the hospital`} icon={f.icon} zoom className="aspect-[3/4]" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />
          <div className="p-5">
            <span className="mb-3 grid size-10 place-items-center rounded-xl bg-mint text-brand-600"><Icon name={f.icon} className="size-5" /></span>
            <h3 className="text-lg font-bold text-navy-950">{f.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-body">{f.summary}</p>
          </div>
          </Tilt3D>
        </AnimatedCard>
      ))}
    </ul>
  );
}

export function Facilities() {
  return (
    <section aria-labelledby="fac-title" className="cv-auto relative isolate overflow-hidden bg-mist py-16 md:py-24">
      <SceneLayer scene="facilities" className="-z-10" />
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="fac-title" particles eyebrow="Facilities" lines={["Modern Facilities"]} text="Everything you need for a consultation, diagnosis and medicines - in one place." />
          <Button href="/facilities" variant="ghost" arrow>All facilities</Button>
        </div>
        <FacilityGrid />
      </div>
    </section>
  );
}

import Link from "next/link";
import { Award, GraduationCap } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { DoctorSilhouette } from "@/components/ui/DoctorSilhouette";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { SceneLayer } from "@/components/three/SceneLayer";
import { resolveImage } from "@/lib/assets";
import { doctors, featuredDoctor } from "@/data/doctors";
import { getDepartment } from "@/data/departments";
import type { Doctor } from "@/types";

export function DoctorCard({ doc }: { doc: Doctor }) {
  const dept = getDepartment(doc.departmentSlug);
  return (
    <AnimatedCard as="li" className="group relative overflow-hidden">
      {[12, 30, 52, 74, 88].map((l, k) => <span key={l} aria-hidden="true" className="float-dot" style={{ left: `${l}%`, animationDelay: `${k * 0.45}s` }} />)}
      <Link href={`/doctors/${doc.slug}`} className="block">
        <Media src={resolveImage(doc.imageKey)} alt={`Portrait of ${doc.name}, ${doc.title}`} fallback={<DoctorSilhouette />} zoom className="aspect-[4/4.4]" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" objectPosition="center top" />
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">{dept?.name}</p>
          <h3 className="mt-1 text-lg font-bold text-navy-950">{doc.name}</h3>
          <p className="text-sm text-slate-body">{doc.qualification}</p>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <WhatsAppButton details={{ doctor: doc.name, department: dept?.name }} className="w-full">Book Appointment</WhatsAppButton>
      </div>
    </AnimatedCard>
  );
}

/** Featured doctor: large editorial layout. */
export function FeaturedDoctor({ doc = featuredDoctor }: { doc?: Doctor }) {
  const dept = getDepartment(doc.departmentSlug);
  return (
    <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint to-white p-5 ring-1 ring-brand-500/15 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-10">
      <Reveal>
        <Tilt3D max={6} className="group"><Media src={resolveImage(doc.imageKey)} alt={`Portrait of ${doc.name}, ${doc.title}`} fallback={<DoctorSilhouette />} objectPosition="center top"
          className="mx-auto aspect-[4/4.6] w-full max-w-md rounded-[1.5rem] shadow-[0_30px_60px_-34px_rgba(8,35,59,0.5)]" sizes="(min-width:1024px) 34vw, 90vw" /></Tilt3D>
      </Reveal>
      <div>
        <Reveal><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Featured Doctor</p></Reveal>
        <Reveal delay={0.05}><h3 className="mt-2 text-[clamp(1.75rem,5.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-navy-950">{doc.name}</h3></Reveal>
        <Reveal delay={0.1}>
          <dl className="mt-4 grid gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2.5 text-navy-950"><GraduationCap className="size-5 shrink-0 text-brand-600" aria-hidden="true" /><dt className="sr-only">Qualification</dt><dd className="font-semibold">{doc.qualification}</dd></div>
            <div className="flex items-center gap-2.5 text-navy-950"><Award className="size-5 shrink-0 text-brand-600" aria-hidden="true" /><dt className="sr-only">Role</dt><dd>{doc.title} · {doc.specialization}</dd></div>
          </dl>
        </Reveal>
        <Reveal delay={0.15}><p className="mt-5 leading-relaxed text-slate-body">{doc.bio}</p></Reveal>
        <Reveal delay={0.2}>
          <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-navy-950">Areas of care</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {doc.areasOfCare.map((a) => <li key={a} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-500/25">{a}</li>)}
          </ul>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton details={{ doctor: doc.name, department: dept?.name }} className="w-full sm:w-auto">Book with {doc.name}</WhatsAppButton>
            <Button href={`/doctors/${doc.slug}`} variant="secondary" arrow className="w-full sm:w-auto">View profile</Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function Doctors() {
  const others = doctors.filter((d) => d.slug !== featuredDoctor.slug);
  return (
    <section aria-labelledby="doctors-title" className="relative isolate overflow-hidden bg-white py-16 md:py-24">
      <SceneLayer scene="doctors" className="-z-10" />
      <div className="container-x">
        <SectionHeading id="doctors-title" particles eyebrow="Our Doctors" lines={["Meet Our Doctors"]} text="Experienced, approachable physicians who take the time to listen." className="mb-10" />
        <FeaturedDoctor />
        {others.length > 0 && (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{others.map((d) => <DoctorCard key={d.slug} doc={d} />)}</ul>
        )}
      </div>
    </section>
  );
}

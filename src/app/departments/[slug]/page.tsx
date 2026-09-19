import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { DoctorCard } from "@/components/sections/Doctors";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { resolveImage } from "@/lib/assets";
import { listedDepartments, getDepartment } from "@/data/departments";
import { doctors } from "@/data/doctors";
import { hospital } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => listedDepartments.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDepartment((await params).slug);
  return d ? pageMeta(`${d.name} in Eraniel, Kanyakumari`, `${d.summary} ${hospital.name}, Eraniel, Kanyakumari District.`, `/departments/${d.slug}`) : {};
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDepartment((await params).slug);
  if (!d) notFound();
  const team = doctors.filter((x) => x.departmentSlug === d.slug);
  const path = `/departments/${d.slug}`;

  return (
    <>
      <PageHero eyebrow="Department" title={d.name} text={d.summary} crumbs={[{ label: "Departments", href: "/departments" }, { label: d.name }]} path={path}>
        <WhatsAppButton details={{ department: d.name }}>Book in {d.name}</WhatsAppButton>
      </PageHero>
      <section className="bg-white py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-mint text-brand-600"><Icon name={d.icon} className="size-7" /></span>
            <h2 className="mt-6 text-2xl font-semibold text-navy-950">About this department</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-body">{d.overview}</p>
            {d.image && <Tilt3D max={4} className="mt-8"><Media src={resolveImage(d.image)} alt={`${d.name} consultation at the hospital`} icon={d.icon} className="aspect-[16/9] rounded-3xl shadow-[0_30px_60px_-38px_rgba(8,35,59,0.5)]" sizes="(min-width:1024px) 55vw, 100vw" /></Tilt3D>}
          </div>
          <div className="rounded-3xl bg-mist p-7">
            <h2 className="text-lg font-bold text-navy-950">Areas of care</h2>
            <ul className="mt-5 space-y-3">
              {d.careAreas.map((c) => <li key={c} className="flex items-center gap-3 text-navy-950"><Check className="size-4 shrink-0 text-brand-600" aria-hidden="true" />{c}</li>)}
            </ul>
          </div>
        </div>
      </section>
      {team.length > 0 && (
        <section className="bg-mist py-14 md:py-20" aria-labelledby="team">
          <div className="container-x">
            <h2 id="team" className="mb-8 text-2xl font-semibold text-navy-950">Doctors in {d.name}</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{team.map((t) => <DoctorCard key={t.slug} doc={t} />)}</ul>
          </div>
        </section>
      )}
    </>
  );
}

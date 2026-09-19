import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FeaturedDoctor } from "@/components/sections/Doctors";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { doctors, getDoctor } from "@/data/doctors";
import { getDepartment } from "@/data/departments";
import { hospital } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";
import { jsonLdScript } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/utils";

export const dynamicParams = false;
export const generateStaticParams = () => doctors.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDoctor((await params).slug);
  return d ? pageMeta(`${d.name} - ${d.title}, ${d.specialization}`, `${d.name} (${d.qualification}), ${d.title} at ${hospital.name}, Eraniel. Areas of care: ${d.areasOfCare.join(", ")}.`, `/doctors/${d.slug}`) : {};
}

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDoctor((await params).slug);
  if (!d) notFound();
  const dept = getDepartment(d.departmentSlug);
  const path = `/doctors/${d.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: d.name,
    jobTitle: d.title,
    description: d.bio,
    url: absoluteUrl(path),
    knowsAbout: d.areasOfCare,
    worksFor: { "@type": "Hospital", name: hospital.name, url: absoluteUrl("/") },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <PageHero eyebrow={dept?.name ?? "Doctor"} title={d.name} text={`${d.qualification} · ${d.title}`} crumbs={[{ label: "Doctors", href: "/doctors" }, { label: d.name }]} path={path}>
        <WhatsAppButton details={{ doctor: d.name, department: dept?.name }}>Book with {d.name}</WhatsAppButton>
      </PageHero>
      <section className="bg-white py-14 md:py-20" aria-labelledby="profile">
        <div className="container-x">
          <h2 id="profile" className="sr-only">Profile of {d.name}</h2>
          <FeaturedDoctor doc={d} />
          {dept && <p className="mt-8 text-slate-body">Department: <Link className="font-bold text-brand-700 underline underline-offset-4" href={`/departments/${dept.slug}`}>{dept.name}</Link></p>}
        </div>
      </section>
    </>
  );
}

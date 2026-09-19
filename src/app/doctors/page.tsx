import { PageHero } from "@/components/layout/PageHero";
import { DoctorCard, FeaturedDoctor } from "@/components/sections/Doctors";
import { doctors, featuredDoctor } from "@/data/doctors";
import { hospital } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Our Doctors - Dr. Melbin, Consultant Physician",
  `Meet the doctors at ${hospital.name}, Eraniel: Dr. Melbin, MBBS, MD (General Medicine), Consultant Physician for fever, infections and diabetes care.`,
  "/doctors",
);

export default function DoctorsPage() {
  const others = doctors.filter((d) => d.slug !== featuredDoctor.slug);
  return (
    <>
      <PageHero eyebrow="Doctors" title="Meet our doctors." text="Experienced, approachable physicians who take the time to listen." crumbs={[{ label: "Doctors" }]} path="/doctors" />
      <section className="bg-white py-14 md:py-20" aria-labelledby="doctors-list">
        <div className="container-x">
          <h2 id="doctors-list" className="sr-only">Our doctors</h2>
          <FeaturedDoctor />
          {others.length > 0 && <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{others.map((d) => <DoctorCard key={d.slug} doc={d} />)}</ul>}
        </div>
      </section>
    </>
  );
}

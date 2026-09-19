import { PageHero } from "@/components/layout/PageHero";
import { FacilityGrid } from "@/components/sections/Facilities";
import { Contact } from "@/components/sections/Contact";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta(
  "Facilities - Consultation Rooms, Laboratory & Ultrasound",
  `Explore the facilities at ${hospital.name}, Eraniel: consultation rooms, laboratory, ultrasound scanning and pharmacy under one roof.`,
  "/facilities",
);

export default function FacilitiesPage() {
  return (
    <>
      <PageHero eyebrow="Facilities" title="Modern facilities." text="Everything you need for a consultation, diagnosis and medicines - in one place." crumbs={[{ label: "Facilities" }]} path="/facilities" />
      <section className="bg-mist py-14 md:py-20" aria-labelledby="all-facilities">
        <div className="container-x"><h2 id="all-facilities" className="sr-only">Our facilities</h2><FacilityGrid /></div>
      </section>
      <Contact />
    </>
  );
}

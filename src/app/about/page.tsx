import { PageHero } from "@/components/layout/PageHero";
import { About } from "@/components/sections/About";
import { Doctors } from "@/components/sections/Doctors";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta(
  "About Us - Multispeciality Hospital in Eraniel",
  `Learn about ${hospital.name} in Eraniel, Kanyakumari: patient-centered care, experienced doctors, on-site diagnostics and a pharmacy for the whole family.`,
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Care that feels close to home." text={hospital.description} crumbs={[{ label: "About Us" }]} path="/about" />
      <About full />
      <Doctors />
      <AppointmentCTA />
    </>
  );
}

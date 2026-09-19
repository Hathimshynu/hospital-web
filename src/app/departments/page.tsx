import { PageHero } from "@/components/layout/PageHero";
import { DepartmentGrid } from "@/components/sections/Departments";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta(
  "Departments - General Medicine & Maternity Care",
  `Explore the departments at ${hospital.name}, Eraniel: General Medicine and Obstetrics & Gynecology, backed by on-site laboratory and ultrasound services.`,
  "/departments",
);

export default function DepartmentsPage() {
  return (
    <>
      <PageHero eyebrow="Departments" title="Comprehensive care under one roof." text="Specialist teams and on-site diagnostics working together for you and your family." crumbs={[{ label: "Departments" }]} path="/departments" />
      <section className="bg-mist py-14 md:py-20"><div className="container-x"><h2 className="sr-only">Our departments</h2><DepartmentGrid /></div></section>
      <AppointmentCTA />
    </>
  );
}

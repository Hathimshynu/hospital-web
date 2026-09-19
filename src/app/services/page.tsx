import { PageHero } from "@/components/layout/PageHero";
import { ServiceGrid } from "@/components/sections/Services";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta(
  "Services - Lab, Ultrasound Scanning & Pharmacy",
  `${hospital.name} in Eraniel offers General Medicine consultations, blood checking & typing, lab investigations, ultrasound scanning and a pharmacy.`,
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Advanced healthcare services." text="Consultation, diagnostics and pharmacy - together, so your care stays simple and coordinated." crumbs={[{ label: "Services" }]} path="/services" />
      <section className="bg-white py-14 md:py-20" aria-labelledby="all-services">
        <div className="container-x">
          <h2 id="all-services" className="sr-only">All services</h2>
          <ServiceGrid detailed />
          <p className="mt-6 text-sm text-slate-body">Tap a service to start a WhatsApp booking for it.</p>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}

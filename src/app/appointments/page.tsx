import { PageHero } from "@/components/layout/PageHero";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { listedDepartments } from "@/data/departments";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import { hospital } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Book an Appointment on WhatsApp",
  `Request an appointment at ${hospital.name}, Eraniel. Choose a department, doctor or service and continue on WhatsApp for confirmation.`,
  "/appointments",
);

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ department?: string; doctor?: string; service?: string }> }) {
  const sp = await searchParams;
  // Accept only known slugs from the query string.
  const preset = {
    department: listedDepartments.find((d) => d.slug === sp.department)?.slug,
    doctor: doctors.find((d) => d.slug === sp.doctor)?.slug,
    service: services.find((s) => s.slug === sp.service)?.slug,
  };
  return (
    <>
      <PageHero eyebrow="Appointments" title="Book your appointment." text="Share a few details and continue on WhatsApp - our team will confirm your time." crumbs={[{ label: "Appointments" }]} path="/appointments" />
      <AppointmentCTA id="book" preset={preset} />
    </>
  );
}

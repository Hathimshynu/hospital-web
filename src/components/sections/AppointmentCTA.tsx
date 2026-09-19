import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { hospital } from "@/data/hospital";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function AppointmentCTA({ id = "appointment", preset }: { id?: string; preset?: { department?: string; doctor?: string; service?: string } }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="bg-gradient-to-b from-mint/60 to-white py-16 md:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading id={`${id}-title`} particles eyebrow="Appointments" lines={["Book Your Appointment", "on WhatsApp"]} text="Tell us what you need. We'll open WhatsApp with your details filled in, and our team will confirm your time." />
          <ul className="mt-8 space-y-4 text-sm text-navy-950">
            <Reveal as="li" className="flex gap-3.5"><MessageCircle className="size-5 shrink-0 text-brand-600" aria-hidden="true" /><span>One tap opens WhatsApp with your message ready to send.</span></Reveal>
            <Reveal as="li" delay={0.06} className="flex gap-3.5"><Clock3 className="size-5 shrink-0 text-brand-600" aria-hidden="true" /><span>Your appointment is confirmed by our team on WhatsApp - not automatically.</span></Reveal>
            <Reveal as="li" delay={0.12} className="flex gap-3.5"><ShieldCheck className="size-5 shrink-0 text-brand-600" aria-hidden="true" /><span>{hospital.name} never stores what you type on this page.</span></Reveal>
          </ul>
          <div className="mt-8"><WhatsAppButton arrow className="min-h-14 w-full px-8 text-base sm:w-auto">Book Appointment on WhatsApp</WhatsAppButton></div>
        </div>
        <Reveal className="rounded-[2rem] border border-navy-950/10 bg-white p-5 shadow-[0_36px_70px_-46px_rgba(8,35,59,0.5)] sm:p-8">
          <AppointmentForm preset={preset} />
        </Reveal>
      </div>
    </section>
  );
}

import { PageHero } from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";
import { hospital, urgentPhone } from "@/data/hospital";

export const metadata = pageMeta("Terms of Use", `Terms for using the ${hospital.name} website.`, "/terms");

const sections = [
  { h: "General information only", p: "Content on this website, including health articles, is for general information and is not medical advice. Always consult a qualified doctor about your health." },
  { h: "Appointment requests", p: `Using the appointment form opens WhatsApp with a pre-filled message. An appointment is confirmed only when ${hospital.name} replies and agrees a time with you.` },
  { h: "Emergencies", p: `Do not rely on this website or on WhatsApp in an emergency. Call ${urgentPhone().display}, or call 108 for an ambulance in a life-threatening situation.` },
  { h: "Accuracy", p: "We work to keep the information on this website accurate, but services, timings and availability can change. Please confirm details with the hospital before you travel." },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" crumbs={[{ label: "Terms" }]} path="/terms" />
      <section className="bg-white py-14 md:py-20">
        <div className="container-x max-w-3xl space-y-8">
          {sections.map((s) => <div key={s.h}><h2 className="text-xl font-semibold text-navy-950">{s.h}</h2><p className="mt-3 leading-relaxed text-slate-body">{s.p}</p></div>)}
        </div>
      </section>
    </>
  );
}

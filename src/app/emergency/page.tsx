import { Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { MapEmbed } from "@/components/sections/Contact";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { hospital, telHref, urgentPhone, fullAddress } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Urgent Medical Help - Call the Hospital",
  `Need medical help? Call ${hospital.name} in Eraniel on ${urgentPhone().display} or message us on WhatsApp. For life-threatening emergencies call 108.`,
  "/emergency",
);

const signs = [
  "Chest pain or pressure",
  "Difficulty breathing",
  "Sudden weakness, confusion or trouble speaking",
  "Severe bleeding or serious injury",
  "Loss of consciousness",
  "Pregnancy warning signs: heavy bleeding, leaking fluid, severe pain or reduced baby movements",
];

export default function EmergencyPage() {
  const phone = urgentPhone();
  return (
    <>
      <PageHero eyebrow="Urgent Care" title="Medical help when you need it." text="Call us straight away, or message us on WhatsApp. In a life-threatening emergency, call 108 for an ambulance." crumbs={[{ label: "Emergency" }]} path="/emergency">
        <a href={telHref(phone)} className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-coral px-7 py-3 font-bold text-white shadow-[0_12px_30px_-12px_rgba(232,105,91,0.9)]">
          <Phone className="size-5" aria-hidden="true" /> Call {phone.display}
        </a>
        <WhatsAppButton>Message on WhatsApp</WhatsAppButton>
      </PageHero>
      <section className="bg-white py-14 md:py-20" aria-labelledby="signs">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="signs" className="text-2xl font-semibold text-navy-950">Seek urgent medical help for</h2>
            <ul className="mt-6 space-y-3">
              {signs.map((s) => <li key={s} className="flex items-start gap-3 text-slate-body"><span className="mt-2 size-2 shrink-0 rounded-full bg-coral" aria-hidden="true" />{s}</li>)}
            </ul>
            <p className="mt-6 text-sm text-slate-body">This list is general and not exhaustive. If in doubt, call.</p>
            <p className="mt-6 font-semibold text-navy-950">{fullAddress()}</p>
          </div>
          <MapEmbed />
        </div>
      </section>
    </>
  );
}

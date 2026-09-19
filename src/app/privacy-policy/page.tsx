import { PageHero } from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta("Privacy Policy", `How ${hospital.name} handles information when you visit this website or contact us.`, "/privacy-policy");

const sections = [
  { h: "Information you give us", p: `This website does not collect your details itself. When you use the appointment form, the details you enter (name, phone number, department, doctor, preferred date and time, and any message) are placed into a WhatsApp message on your own device. You choose whether to send it. The message is then handled through WhatsApp, which has its own privacy policy.` },
  { h: "How we use it", p: `If you message us, we use what you send only to respond to you and to arrange or confirm your appointment. We do not sell personal information. Please do not send sensitive medical records through website forms or public messages.` },
  { h: "Calls and messages", p: `If you call ${hospital.contact.phone.display} or message us on WhatsApp, our team will see your phone number and the information you share so that we can help you.` },
  { h: "Third-party services", p: `This website may display an embedded Google Map. Google may set cookies or collect usage data when the map loads. See Google's privacy policy for details.` },
  { h: "Your choices", p: `You may ask us to correct or delete information you have shared with us by contacting the hospital on ${hospital.contact.phone.display}.` },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} path="/privacy-policy" />
      <section className="bg-white py-14 md:py-20">
        <div className="container-x max-w-3xl space-y-8">
          {sections.map((s) => <div key={s.h}><h2 className="text-xl font-semibold text-navy-950">{s.h}</h2><p className="mt-3 leading-relaxed text-slate-body">{s.p}</p></div>)}
        </div>
      </section>
    </>
  );
}

import { PageHero } from "@/components/layout/PageHero";
import { Contact } from "@/components/sections/Contact";
import { pageMeta } from "@/lib/seo";
import { hospital, fullAddress } from "@/data/hospital";

export const metadata = pageMeta(
  "Contact & Location - Eraniel, Kanyakumari",
  `Find ${hospital.name} at ${fullAddress()}. Call ${hospital.contact.phone.display}, message us on WhatsApp or get directions.`,
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact us." text="Visit us in Eraniel, call, or message us on WhatsApp." crumbs={[{ label: "Contact" }]} path="/contact" />
      <Contact heading={false} />
    </>
  );
}

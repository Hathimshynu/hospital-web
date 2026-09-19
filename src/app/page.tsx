import { Hero } from "@/components/hero/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { Services } from "@/components/sections/Services";
import { Departments } from "@/components/sections/Departments";
import { PregnancyJourney } from "@/components/sections/PregnancyJourney";
import { About } from "@/components/sections/About";
import { Doctors } from "@/components/sections/Doctors";
import { Facilities } from "@/components/sections/Facilities";
import { EmergencyCTA } from "@/components/sections/EmergencyCTA";
import { AppointmentCTA } from "@/components/sections/AppointmentCTA";
import { Contact } from "@/components/sections/Contact";
import { hospital } from "@/data/hospital";
import { hospitalImages } from "@/data/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(hospital.seo.title, hospital.seo.description, "/", { absolute: true });

export default function Home() {
  return (
    <>
      <Hero image={hospitalImages.hero.src} alt={hospitalImages.hero.alt} />
      <TrustSection />
      <Services />
      <Departments />
      <PregnancyJourney />
      <Doctors />
      <Facilities />
      <About />
      <EmergencyCTA />
      <AppointmentCTA />
      <Contact />
    </>
  );
}

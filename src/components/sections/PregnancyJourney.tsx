import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PregnancyStory } from "./PregnancyStory";
import { StoryVertical } from "./StoryVertical";
import { storyStages } from "@/data/story";
import { getDepartment } from "@/data/departments";
import { resolveImage } from "@/lib/assets";

const OB = getDepartment("obstetrics-and-gynecology")?.name;

/** Server component: headings, copy, the vertical story and the closing CTA are all plain HTML. */
export function PregnancyJourney() {
  const stages = storyStages.map((s) => ({ ...s, src: resolveImage(s.imageKey) }));
  return (
    <section aria-labelledby="pregnancy-title" className="bg-gradient-to-b from-white via-mint/50 to-white py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          id="pregnancy-title" align="center" particles eyebrow="Mother & Child Care"
          lines={["Your Pregnancy.", "Our Priority."]}
          text="From the first moment of your journey to the first precious embrace, compassionate care is with you every step of the way."
        />
      </div>
      <PregnancyStory stages={stages}>
        <StoryVertical stages={stages} />
      </PregnancyStory>
      <div className="container-x mt-10 text-center md:mt-14">
        <p className="text-[clamp(1.5rem,5vw,2.25rem)] font-semibold tracking-tight text-navy-950">A New Life. A New Beginning.</p>
        <p className="mx-auto mt-3 max-w-md text-slate-body">Speak to our team about antenatal care and delivery.</p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton details={{ department: OB }} arrow className="w-full sm:w-auto">Book Maternity Consultation</WhatsAppButton>
        </div>
        <p className="mt-6 text-xs text-slate-body/80">Story imagery is illustrative and does not depict actual patients or hospital staff.</p>
      </div>
    </section>
  );
}

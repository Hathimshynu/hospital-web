import { SectionHeading } from "@/components/ui/SectionHeading";
import { PregnancyStory } from "./PregnancyStory";
import { storyStages } from "@/data/story";
import { resolveImage } from "@/lib/assets";

/** Server wrapper: resolves story photographs (if supplied) and renders the scroll-driven story. */
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
      <PregnancyStory stages={stages} />
    </section>
  );
}

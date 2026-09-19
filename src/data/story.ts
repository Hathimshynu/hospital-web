import type { StoryStage } from "@/types";

/**
 * The six-stage mother & child story, mapped to the photographs in
 * public/images/story/ (optimised copies of preganacy_1 … preganacy_6).
 * Stage text describes what each photograph actually shows.
 */
export const storyStages: StoryStage[] = [
  {
    id: "family", n: "01", title: "Every Journey Begins With Care", kicker: "Pregnancy & family",
    text: "A mother-to-be at home, held close by her husband and family - worried, hopeful, and knowing that skilled help is nearby.",
    icon: "users", imageKey: "story/01",
    alt: "An expectant mother at home on a sofa, comforted by her husband and an older family member",
  },
  {
    id: "arrival", n: "02", title: "Arriving With Hope", kicker: "Arriving at the hospital",
    text: "Supported by her husband, she walks into the hospital. From the very first step, guidance is calm and clear.",
    icon: "building", imageKey: "story/02",
    alt: "A pregnant woman supported by her husband as they walk in through a hospital entrance",
  },
  {
    id: "care", n: "03", title: "Expert Care When It Matters", kicker: "Doctors & nurses",
    text: "A doctor and nurse welcome the couple, explain what happens next and walk alongside them - nobody is left to wonder.",
    icon: "stethoscope", imageKey: "story/03",
    alt: "A doctor and nurse in scrubs talking with a pregnant woman in a wheelchair and her husband in a hospital corridor",
  },
  {
    id: "labor", n: "04", title: "Compassion Through Every Moment", kicker: "Maternity care",
    text: "In a quiet room, the mother is monitored and cared for while her husband stays close and the team keeps them informed.",
    icon: "bed", imageKey: "story/04",
    alt: "A mother resting in a hospital bed with her husband beside her as two clinicians talk with her",
  },
  {
    id: "newborn", n: "05", title: "A New Life. A New Beginning.", kicker: "The newborn",
    text: "A healthy newborn rests safely beside his mother while the new parents hold hands and take in the first quiet moments.",
    icon: "baby", imageKey: "story/05",
    alt: "A newborn baby sleeping in a clear hospital bassinet with the mother and father holding hands behind",
  },
  {
    id: "family-together", n: "06", title: "A Family's Happiest Moment", kicker: "Together at last",
    text: "Father, mother and grandparents together, smiling at the newest member of the family - and a hospital they will remember kindly.",
    icon: "smile", imageKey: "story/06",
    alt: "A father holding his newborn while the mother and grandparents smile in a hospital room",
  },
];

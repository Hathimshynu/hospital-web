import type { BlogPost } from "@/types";

/** General health information only - not a substitute for medical advice. */
export const blogPosts: BlogPost[] = [
  {
    slug: "when-to-see-a-doctor-for-fever",
    title: "When to See a Doctor for a Fever",
    category: "Health Tips",
    excerpt: "Most fevers settle with rest and fluids, but some need a doctor's attention. Here is how to tell the difference.",
    description: "Learn which fever symptoms can be managed at home and which warning signs mean you should see a doctor without delay.",
    publishedAt: "2026-09-01",
    readMinutes: 3,
    imageKey: "blog/fever",
    sections: [
      {
        heading: "Fever is a sign, not a diagnosis",
        paragraphs: [
          "A fever is the body's response to something - most often an infection. In many adults and older children a mild fever from a viral illness settles within a few days with rest, plenty of fluids and light meals.",
          "Because fever can accompany very different conditions, from a common cold to infections that need treatment, how you feel and how long it lasts matter as much as the temperature itself.",
        ],
      },
      {
        heading: "Warning signs that need prompt medical attention",
        paragraphs: [
          "See a doctor without delay if a fever comes with difficulty breathing, severe headache or a stiff neck, confusion or unusual drowsiness, a new skin rash, repeated vomiting, severe abdominal pain, or pain when passing urine.",
          "Seek care sooner for very young babies, pregnant women, older adults, and anyone with diabetes or another long-term condition, as they can become unwell more quickly.",
        ],
      },
      {
        heading: "A fever that lasts or keeps returning",
        paragraphs: [
          "A fever that lasts more than a few days, or keeps coming back, deserves an examination and, where needed, simple tests such as a blood check. Please avoid self-medicating with antibiotics - they do not help viral fevers and should only be taken when prescribed.",
          "If you are unsure, it is always reasonable to ask a doctor. Our General Medicine department is available for consultation.",
        ],
      },
    ],
  },
  {
    slug: "everyday-habits-for-managing-diabetes",
    title: "Everyday Habits for Managing Diabetes",
    category: "Preventive Care",
    excerpt: "Small daily routines around food, movement and check-ups make living well with diabetes far easier.",
    description: "Practical, everyday habits that help people with diabetes stay well: balanced meals, regular activity, medicines and check-ups.",
    publishedAt: "2026-09-08",
    readMinutes: 4,
    imageKey: "blog/diabetes",
    sections: [
      {
        heading: "Build meals around balance",
        paragraphs: [
          "A steady, balanced plate helps keep blood sugar more even through the day. Include vegetables, pulses and whole grains, watch portion sizes of rice and other starchy foods, and limit sugary drinks and sweets.",
          "Eating at regular times and not skipping meals is often as important as what is on the plate. Ask your doctor to tailor advice to your medicines and lifestyle.",
        ],
      },
      {
        heading: "Move a little, most days",
        paragraphs: [
          "Regular physical activity - such as a brisk daily walk - helps the body use insulin better and supports a healthy weight. Choose something you enjoy so that it becomes a habit rather than a chore.",
        ],
      },
      {
        heading: "Take medicines as prescribed and keep your check-ups",
        paragraphs: [
          "Take medicines exactly as prescribed and never stop or change a dose without speaking to your doctor. Keep to your follow-up visits and any blood tests your doctor advises, so that treatment can be adjusted early.",
          "Look after your feet and eyes: check your feet daily for cuts or sores, wear comfortable footwear, and have your eyes examined regularly. If something looks or feels wrong, get it checked promptly.",
        ],
      },
    ],
  },
  {
    slug: "why-antenatal-check-ups-matter",
    title: "Why Regular Antenatal Check-ups Matter",
    category: "Medical Awareness",
    excerpt: "Regular check-ups during pregnancy help protect both mother and baby. Here is what to know and when to call.",
    description: "Understand why regular antenatal visits matter, what they involve, and the warning signs that mean you should contact your doctor straight away.",
    publishedAt: "2026-09-15",
    readMinutes: 4,
    imageKey: "blog/antenatal",
    sections: [
      {
        heading: "Care that starts early and continues",
        paragraphs: [
          "Antenatal care is the regular check-ups a woman has during pregnancy. Visits help your doctor follow your health and your baby's growth, arrange any tests or scans that are needed, and answer your questions.",
          "Try to begin early and keep every scheduled visit, even when you feel perfectly well. Many problems can be spotted and managed more easily when they are found early.",
        ],
      },
      {
        heading: "Looking after yourself",
        paragraphs: [
          "Eat a varied, nutritious diet, drink enough water, rest well and stay gently active as your doctor advises. Take only the supplements and medicines your doctor has recommended - please do not self-medicate during pregnancy.",
        ],
      },
      {
        heading: "Warning signs - contact your doctor straight away",
        paragraphs: [
          "Get medical help promptly if you have vaginal bleeding, leaking of fluid, severe or persistent headache, blurred vision, sudden swelling of the face or hands, severe abdominal pain, a fever, or if your baby is moving noticeably less than usual.",
          "It also helps to plan ahead: know how you will reach the hospital, keep your records with you, and have a family member ready to help. Our Obstetrics & Gynecology team is here to support you and your family.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

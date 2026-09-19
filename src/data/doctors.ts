import type { Doctor } from "@/types";

/**
 * Only verified doctors belong here. To add one, append an entry and drop the
 * photo at public/images/doctors/<slug>.jpg (see public/images/README.md).
 */
export const doctors: Doctor[] = [
  {
    slug: "dr-melbin",
    name: "Dr. Melbin",
    qualification: "MBBS, MD (General Medicine)",
    title: "Consultant Physician",
    specialization: "General Medicine",
    departmentSlug: "general-medicine",
    areasOfCare: ["Fever & Infections", "Diabetes Management", "Lifestyle Diseases", "General Physician"],
    bio: "Dr. Melbin is a Consultant Physician with an MBBS and an MD in General Medicine. He sees adult patients for fever and infections, diabetes management and lifestyle diseases, and provides general physician care for families.",
    imageKey: "doctors/dr-melbin",
    featured: true,
  },
];

export const featuredDoctor = doctors.find((d) => d.featured) ?? doctors[0];
export const getDoctor = (slug: string) => doctors.find((d) => d.slug === slug);

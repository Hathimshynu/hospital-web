import type { Department } from "@/types";

/**
 * Departments the hospital has confirmed (`listed: true`) are displayed,
 * linked from the site and included in the sitemap. The others are kept here
 * ready to switch on - set `listed: true` only once a department is confirmed.
 */
export const departments: Department[] = [
  {
    slug: "general-medicine",
    name: "General Medicine",
    icon: "stethoscope",
    summary: "Consultant physician care for fever & infections, diabetes and lifestyle diseases.",
    overview:
      "Our General Medicine department is the first point of care for adults. Led by a consultant physician, it covers the diagnosis and ongoing management of everyday illnesses and long-term conditions, supported by on-site laboratory investigations and pharmacy.",
    careAreas: ["Fever & infections", "Diabetes management", "Lifestyle diseases", "General physician consultation"],
    listed: true,
    image: "departments/general-medicine",
  },
  {
    slug: "obstetrics-and-gynecology",
    name: "Obstetrics & Gynecology",
    icon: "baby",
    summary: "Caring support for women and families through pregnancy and childbirth.",
    overview:
      "Every mother's journey deserves attentive, respectful care. Our Obstetrics & Gynecology department supports women and their families through pregnancy, delivery and the first days with a newborn, with ultrasound scanning and laboratory services available on site.",
    careAreas: ["Antenatal care", "Pregnancy scanning", "Maternity care", "Women's health consultation"],
    listed: true,
    image: "departments/obstetrics-and-gynecology",
  },
  { slug: "pediatrics", name: "Pediatrics", icon: "smile", summary: "Care for infants, children and teenagers.", overview: "", careAreas: [], listed: false },
  { slug: "cardiology", name: "Cardiology", icon: "heart", summary: "Care for the heart and circulation.", overview: "", careAreas: [], listed: false },
  { slug: "orthopedics", name: "Orthopedics", icon: "bone", summary: "Bone, joint and muscle care.", overview: "", careAreas: [], listed: false },
  { slug: "dermatology", name: "Dermatology", icon: "sparkles", summary: "Care for skin, hair and nails.", overview: "", careAreas: [], listed: false },
  { slug: "ent", name: "ENT", icon: "ear", summary: "Ear, nose and throat care.", overview: "", careAreas: [], listed: false },
];

export const listedDepartments = departments.filter((d) => d.listed);
export const getDepartment = (slug: string) => listedDepartments.find((d) => d.slug === slug);

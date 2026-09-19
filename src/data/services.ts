import type { Service } from "@/types";

/** Services confirmed from the hospital's own information. */
export const services: Service[] = [
  {
    slug: "general-medicine",
    name: "General Medicine",
    icon: "stethoscope",
    summary: "Consultations with a physician for everyday illness and long-term conditions.",
    detail: "See a consultant physician for fever and infections, diabetes management, lifestyle diseases and general health concerns.",
  },
  {
    slug: "blood-checking-and-typing",
    name: "Blood Checking & Typing",
    icon: "droplet",
    summary: "Blood tests and blood group typing on site.",
    detail: "Blood checking and blood group typing are available at the hospital, helping your doctor reach a diagnosis without sending you elsewhere.",
  },
  {
    slug: "lab-investigations",
    name: "Lab Investigations",
    icon: "flask",
    summary: "Laboratory investigations to support accurate diagnosis.",
    detail: "Laboratory investigations are carried out in-house so results reach your doctor quickly and your care stays coordinated.",
  },
  {
    slug: "ultrasound-scanning",
    name: "Ultrasound Scanning",
    icon: "scan",
    summary: "Ultrasound scanning for diagnosis and pregnancy care.",
    detail: "Ultrasound scanning is available on site to support diagnosis and to help monitor pregnancy.",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    icon: "pill",
    summary: "Prescribed medicines available at the hospital.",
    detail: "Collect your prescribed medicines from the hospital pharmacy after your consultation.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
